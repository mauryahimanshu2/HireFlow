namespace HireFlow.DTOs.Recruiter;

public class CreateRecruiterProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Designation { get; set; }
    public int? CompanyId { get; set; }
}