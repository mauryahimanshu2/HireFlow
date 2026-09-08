namespace HireFlow.Models;

public class JobSeekerProfile
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Location { get; set; }

    public string? Skills { get; set; }

    public string? Education { get; set; }

    public string? Experience { get; set; }

    public string? ProfileImageUrl { get; set; }

    public string? ResumeUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Relationships
    public User User { get; set; } = null!;

    public ICollection<JobApplication> Applications { get; set; }
        = new List<JobApplication>();
}