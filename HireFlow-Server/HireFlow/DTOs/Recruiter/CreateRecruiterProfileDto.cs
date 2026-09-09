using System.ComponentModel.DataAnnotations;

namespace HireFlow.DTOs.Recruiter;

public class CreateRecruiterProfileDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Phone]
    [StringLength(20)]
    public string? Phone { get; set; }

    [StringLength(100)]
    public string? Designation { get; set; }

    public int? CompanyId { get; set; }
}