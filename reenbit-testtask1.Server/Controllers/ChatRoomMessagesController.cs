using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace reenbit_testtask1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomMessagesController : ControllerBase
    {
        private readonly ReenbitTaskChatroomDatabaseContext _context;

        public ChatRoomMessagesController(ReenbitTaskChatroomDatabaseContext context)
        {
            _context = context;
        }

        // GET: api/<ValuesController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChatRoomDatabase>>> GetMessages(int? skip, int? take)
        {
            if (skip != null && take != null)
            {
                return await _context.ChatRoomDatabases.OrderByDescending(e=>e.SentAt).Skip((int)skip).Take((int)take).ToListAsync();
            }
            return await _context.ChatRoomDatabases.ToListAsync();
        }
        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChatRoomDatabase>> GetMessage(int id)
        {
            var message = await _context.ChatRoomDatabases.FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            return message;
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<ChatRoomDatabase>> PostMessage([FromBody] ChatRoomDatabase message)
        {
            message.SentAt = DateTime.UtcNow;
            _context.ChatRoomDatabases.Add(message);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMessage), new { id = message.MessageId }, message);
        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessage(int id, [FromBody] ChatRoomDatabase updatedMessage)
        {
            if (id != updatedMessage.MessageId)
            {
                return BadRequest();
            }

            var message = await _context.ChatRoomDatabases.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            message.Username = updatedMessage.Username;
            message.MessageText = updatedMessage.MessageText;
            message.SentimentLabel = updatedMessage.SentimentLabel;
            message.ScorePositive = updatedMessage.ScorePositive;
            message.ScoreNeutral = updatedMessage.ScoreNeutral;
            message.ScoreNegative = updatedMessage.ScoreNegative;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.ChatRoomDatabases.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.ChatRoomDatabases.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
