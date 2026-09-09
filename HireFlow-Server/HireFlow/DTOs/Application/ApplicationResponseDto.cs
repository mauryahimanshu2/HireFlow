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

    public string Status { get; set; } = string.Empty;

    public DateTime AppliedAt { get; set; }
    public DateTime? WithdrawnAt { get; set; }

    public string? RecruiterRemarks { get; set; }
    public DateTime? UpdatedAt { get; set; }
}