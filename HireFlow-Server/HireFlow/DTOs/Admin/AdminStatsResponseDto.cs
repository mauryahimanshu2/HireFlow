namespace HireFlow.DTOs.Admin;

public class AdminStatsResponseDto
{
    public int TotalUsers { get; set; }

    public int TotalJobSeekers { get; set; }

    public int TotalRecruiters { get; set; }

    public int TotalJobs { get; set; }

    public int ActiveJobs { get; set; }

    public int InactiveJobs { get; set; }

    public int TotalApplications { get; set; }
}