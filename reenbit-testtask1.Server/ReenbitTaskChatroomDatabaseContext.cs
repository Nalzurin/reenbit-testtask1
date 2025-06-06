﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace reenbit_testtask1.Server;

public partial class ReenbitTaskChatroomDatabaseContext : DbContext
{
    //Automatically generated by scaffolding the database
    public ReenbitTaskChatroomDatabaseContext()
    {
    }

    public ReenbitTaskChatroomDatabaseContext(DbContextOptions<ReenbitTaskChatroomDatabaseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChatRoomDatabase> ChatRoomDatabases { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChatRoomDatabase>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__chat_roo__0BBF6EE6F73B6D00");

            entity.ToTable("chat_room_database");

            entity.Property(e => e.MessageId).HasColumnName("message_id");
            entity.Property(e => e.MessageText)
                .HasMaxLength(2000)
                .HasColumnName("message_text");
            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("sent_at");
            entity.Property(e => e.SentimentLabel).HasMaxLength(10);
            entity.Property(e => e.Username)
                .HasMaxLength(200)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
