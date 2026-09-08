namespace HireFlow.DTOs.Company;

public class CreateCompanyDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Industry { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
    public string? CompanySize { get; set; }
}