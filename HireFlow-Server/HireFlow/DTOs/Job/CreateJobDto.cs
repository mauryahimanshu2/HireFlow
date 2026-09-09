using System.ComponentModel.DataAnnotations;

namespace HireFlow.DTOs.Job;

public class CreateJobDto
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(5000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

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
}