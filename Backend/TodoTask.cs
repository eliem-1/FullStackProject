using System.ComponentModel.DataAnnotations;

public class TodoTask
{
    public int Id { get; set; }

    [Required]
    [MinLength(3, ErrorMessage = "Task description must be at least 3 characters long.")]
    public string Description { get; set; } = string.Empty;

    public bool IsComplete { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}