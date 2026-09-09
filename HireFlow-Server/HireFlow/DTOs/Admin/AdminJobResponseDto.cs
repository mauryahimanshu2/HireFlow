namespace HireFlow.DTOs.Admin;

public class AdminJobResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Location { get; set; }

    public string? EmploymentType { get; set; }

    public decimal? SalaryMin { get; set; }

    public decimal? SalaryMax { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public int CompanyId { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public int RecruiterId { get; set; }

    public string RecruiterName { get; set; } = string.Empty;
}