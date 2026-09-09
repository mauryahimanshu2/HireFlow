using HireFlow.DTOs.Job;

namespace HireFlow.Services.Interfaces;

public interface IJobService
{
    Task<JobResponseDto> CreateAsync(
        int userId,
        CreateJobDto dto);

    Task<JobResponseDto?> GetByIdAsync(
        int jobId);

    Task<List<JobResponseDto>> GetAllAsync(
    JobFilterDto filter);

    Task<JobResponseDto?> UpdateAsync(
        int userId,
        int jobId,
        UpdateJobDto dto);

    Task<JobResponseDto?> PatchAsync(
        int userId,
        int jobId,
        UpdateJobDto dto);

    Task<bool> DeleteAsync(
        int userId,
        int jobId);

    Task<List<JobResponseDto>> GetMyJobsAsync(
        int userId);
}