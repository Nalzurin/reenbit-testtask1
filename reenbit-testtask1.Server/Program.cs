
using Microsoft.EntityFrameworkCore;
using reenbit_testtask1.Server.Hubs;
using System;

namespace reenbit_testtask1.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            //Adding SignalR
            builder.Services.AddSignalR().AddAzureSignalR();
            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            //Secrets for storing keys and strings when developing locally

            if (builder.Environment.IsDevelopment())
            {
                builder.Configuration.AddUserSecrets<Program>();
            }
            //Database
            builder.Services.AddDbContext<ReenbitTaskChatroomDatabaseContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            //AI text analysis service
            builder.Services.AddSingleton<TextAnalysisService>();
            var app = builder.Build();

            app.UseDefaultFiles();

            // When developing to skip the need for correct cors setup
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseCors(x => x.AllowAnyMethod()
                                  .AllowAnyHeader()
                                  .SetIsOriginAllowed(origin => true) // allow any origin
                                  .AllowCredentials()); // allow credentials
            }


            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();
            //Endpoint for the SignalR hub
            app.MapHub<ChatRoomHub>("/chatRoomHub");

            //Fallback just to test if server is alive
            app.MapFallback(() => "hi!");

            app.Run();
        }
    }
}
