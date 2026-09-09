using System.ComponentModel.DataAnnotations;

namespace HireFlow.DTOs.JobSeeker;

public class UpdateJobSeekerProfileDto
{
    [StringLength(100, MinimumLength = 2)]
    public string? FullName { get; set; }

    [Phone]
    [StringLength(20)]
    public string? Phone { get; set; }

    [StringLength(100)]
    public string? Location { get; set; }

    [StringLength(500)]
    public string? Skills { get; set; }

    [StringLength(500)]
    public string? Education { get; set; }

    [StringLength(2000)]
    public string? Experience { get; set; }
}