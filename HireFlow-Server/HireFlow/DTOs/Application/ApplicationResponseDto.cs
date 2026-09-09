namespace HireFlow.DTOs.Application;

public class ApplicationResponseDto
{
    public int Id { get; set; }

    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;

    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;

    public int JobSeekerId { get; set; }
    public string JobSeekerName { get; set; } = string.Empty;
    public string? JobSeekerEmail { get; set; }
    public string? JobSeekerPhone { get; set; }
    public string? JobSeekerLocation { get; set; }
    public string? JobSeekerSkills { get; set; }
    public string? JobSeekerEducation { get; set; }
    public string? JobSeekerExperience { get; set; }
    public string? JobSeekerProfileImageUrl { get; set; }
    public string? JobSeekerResumeUrl { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime AppliedAt { get; set; }
    public DateTime? WithdrawnAt { get; set; }

    public string? RecruiterRemarks { get; set; }
    public DateTime? UpdatedAt { get; set; }
}