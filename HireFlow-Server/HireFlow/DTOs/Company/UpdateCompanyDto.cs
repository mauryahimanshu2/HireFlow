using System.ComponentModel.DataAnnotations;

namespace HireFlow.DTOs.Company;

public class UpdateCompanyDto
{
    [StringLength(150, MinimumLength = 2)]
    public string? CompanyName { get; set; }

    [StringLength(2000)]
    public string? Description { get; set; }

    [StringLength(100)]
    public string? Industry { get; set; }

    [StringLength(100)]
    public string? Location { get; set; }

    [Url]
    [StringLength(500)]
    public string? Website { get; set; }

    [StringLength(50)]
    public string? CompanySize { get; set; }
}