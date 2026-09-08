namespace HireFlow.DTOs.JobSeeker;

public class CreateJobSeekerProfileDto
{
    public string FullName { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Location { get; set; }

    public string? Skills { get; set; }

    public string? Education { get; set; }

    public string? Experience { get; set; }
}