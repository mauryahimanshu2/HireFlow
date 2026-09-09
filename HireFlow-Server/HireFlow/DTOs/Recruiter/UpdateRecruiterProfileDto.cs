using System.ComponentModel.DataAnnotations;

namespace HireFlow.DTOs.Recruiter;

public class UpdateRecruiterProfileDto
{
    [StringLength(100, MinimumLength = 2)]
    public string? FullName { get; set; }

    [Phone]
    [StringLength(20)]
    public string? Phone { get; set; }

    [StringLength(100)]
    public string? Designation { get; set; }

    public int? CompanyId { get; set; }
}