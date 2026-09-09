namespace HireFlow.DTOs.Job;

public class UpdateJobDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public string? ExperienceRequired { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public string? Skills { get; set; }
    public bool? IsActive { get; set; }
}