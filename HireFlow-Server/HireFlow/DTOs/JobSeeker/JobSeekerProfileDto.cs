namespace HireFlow.DTOs.JobSeeker;

public class JobSeekerProfileDto
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

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}