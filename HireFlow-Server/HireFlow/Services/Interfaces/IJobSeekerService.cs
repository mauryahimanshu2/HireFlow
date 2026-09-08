using HireFlow.DTOs.JobSeeker;

namespace HireFlow.Services.Interfaces;

public interface IJobSeekerService
{
    Task<JobSeekerProfileDto> CreateAsync(
        int userId,
        CreateJobSeekerProfileDto dto);

    Task<JobSeekerProfileDto?> GetAsync(int userId);

    Task<JobSeekerProfileDto?> UpdateAsync(
        int userId,
        UpdateJobSeekerProfileDto dto);

    Task<JobSeekerProfileDto?> PatchAsync(
        int userId,
        UpdateJobSeekerProfileDto dto);

    Task<bool> DeleteAsync(int userId);
}