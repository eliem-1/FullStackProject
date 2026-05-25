using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private static readonly List<TodoTask> _databaseList = new()
    {
        new TodoTask { Id = 1, Description = "Fix backend security setup" },
        new TodoTask { Id = 2, Description = "Connect interface components" }
    };

    [HttpGet]
    public ActionResult<IEnumerable<TodoTask>> GetAllTasks()
    {
        return Ok(_databaseList);
    }

    [HttpPost]
    public ActionResult<TodoTask> AddNewTask([FromBody] TodoTask task)
    {
        task.Id = _databaseList.Count + 1;
        _databaseList.Add(task);
        return Ok(task);
    }
}