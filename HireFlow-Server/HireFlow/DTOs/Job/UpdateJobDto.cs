using System.ComponentModel.DataAnnotations;

namespace HireFlow.DTOs.Job;

public class UpdateJobDto
{
    [StringLength(200, MinimumLength = 2)]
    public string? Title { get; set; }

    [StringLength(5000, MinimumLength = 10)]
    public string? Description { get; set; }

    [StringLength(100)]
    public string? Location { get; set; }

    [StringLength(50)]
    public string? EmploymentType { get; set; }

    [StringLength(100)]
    public string? ExperienceRequired { get; set; }

    [Range(0, 999999999)]
    public decimal? SalaryMin { get; set; }

    [Range(0, 999999999)]
    public decimal? SalaryMax { get; set; }

    [StringLength(1000)]
    public string? Skills { get; set; }

    public bool? IsActive { get; set; }
}