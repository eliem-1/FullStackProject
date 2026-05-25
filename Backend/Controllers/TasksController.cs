using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoTask>>> GetAllTasks()
    {
        return Ok(await _context.Tasks.OrderBy(t => t.Id).ToListAsync());
    }

    [HttpGet("{id:int}", Name = nameof(GetTaskById))]
    public async Task<ActionResult<TodoTask>> GetTaskById(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        return task is not null ? Ok(task) : NotFound();
    }

    [HttpPost]
    public async Task<ActionResult<TodoTask>> AddNewTask([FromBody] TodoTask task)
    {
        if (task is null || string.IsNullOrWhiteSpace(task.Description))
        {
            return BadRequest(new { Message = "A valid task description is required." });
        }

        task.CreatedAt = DateTime.UtcNow;
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtRoute(nameof(GetTaskById), new { id = task.Id }, task);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id:int}/toggle")]
    public async Task<ActionResult<TodoTask>> ToggleCompletion(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is null)
        {
            return NotFound();
        }

        task.IsComplete = !task.IsComplete;
        await _context.SaveChangesAsync();
        return Ok(task);
    }
}