namespace HireFlow.Models;

public class RecruiterProfile
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Designation { get; set; }

    public int? CompanyId { get; set; }

    public string? ProfileImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Relationships
    public User User { get; set; } = null!;

    public Company? Company { get; set; }

    public ICollection<Job> Jobs { get; set; }
        = new List<Job>();
}