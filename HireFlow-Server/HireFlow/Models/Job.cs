namespace HireFlow.Models;

public class Job
{
    public int Id { get; set; }

    public int CompanyId { get; set; }

    public int RecruiterId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? Location { get; set; }

    public string? EmploymentType { get; set; }

    public string? ExperienceRequired { get; set; }

    public decimal? SalaryMin { get; set; }

    public decimal? SalaryMax { get; set; }

    public string? Skills { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Relationships
    public Company Company { get; set; } = null!;

    public RecruiterProfile Recruiter { get; set; } = null!;

    public ICollection<JobApplication> Applications { get; set; }
        = new List<JobApplication>();
}