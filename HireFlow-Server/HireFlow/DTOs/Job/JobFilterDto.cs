namespace HireFlow.DTOs.Job;

public class JobFilterDto
{
    public string? Keyword { get; set; }
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public decimal? MinSalary { get; set; }
    public decimal? MaxSalary { get; set; }
}