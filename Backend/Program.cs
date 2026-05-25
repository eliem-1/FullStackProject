using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- 1. SECURITY POLICY SETUP (CORS) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();
builder.Services.AddControllers();

// Connect to a local SQLite database file named tasks.db
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

var app = builder.Build();

// --- 2. MIDDLEWARE ---
app.UseRouting();
app.UseCors("AllowReact");
app.UseAuthorization();

app.MapControllers();
app.MapGet("/ping", () => Results.Ok("pong")).WithName("Ping");

app.Run();