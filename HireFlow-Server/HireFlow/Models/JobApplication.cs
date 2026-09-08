namespace HireFlow.Models;

public class JobApplication
{
    public int Id { get; set; }

    public int JobId { get; set; }

    public int JobSeekerId { get; set; }

    public string Status { get; set; } = "Applied";

    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    public DateTime? WithdrawnAt { get; set; }

    public string? RecruiterRemarks { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Relationships
    public Job Job { get; set; } = null!;

    public JobSeekerProfile JobSeeker { get; set; } = null!;
}