using HireFlow.DTOs.Admin;

namespace HireFlow.Services.Interfaces;

public interface IAdminService
{
    // User management
    Task<List<AdminUserResponseDto>> GetUsersAsync();

    Task<bool> BlockUserAsync(int userId);

    Task<bool> UnblockUserAsync(int userId);

    // Job management
    Task<List<AdminJobResponseDto>> GetJobsAsync();

    Task<bool> ActivateJobAsync(int jobId);

    Task<bool> DeactivateJobAsync(int jobId);


    // Statistics
    Task<AdminStatsResponseDto> GetStatsAsync();
}