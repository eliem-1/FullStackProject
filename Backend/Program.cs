var builder = WebApplication.CreateBuilder(args);

// --- 1. SECURITY POLICY SETUP (CORS) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite's port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();
builder.Services.AddControllers();

var tasks = new List<TodoTask>
{
    new TodoTask { Id = 1, Description = "Fix backend security setup" },
    new TodoTask { Id = 2, Description = "Connect interface components" }
};

var app = builder.Build();

// --- 2. ACTIVATE THE SECURITY POLICY ---
app.UseRouting();
app.UseCors("AllowReact");
app.UseAuthorization();

app.MapControllers();
app.MapGet("/ping", () => Results.Ok("pong"));
app.MapGet("/api/tasks", () => Results.Ok(tasks));
app.MapPost("/api/tasks", async (TodoTask task) =>
{
    task.Id = tasks.Count + 1;
    tasks.Add(task);
    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.Run();