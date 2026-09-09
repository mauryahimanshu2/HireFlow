using HireFlow.DTOs.Application;

namespace HireFlow.Services.Interfaces;

public interface IApplicationService
{
    Task<ApplicationResponseDto> ApplyAsync(
        int userId,
        CreateApplicationDto dto);

    Task<List<ApplicationResponseDto>> GetMyApplicationsAsync(
        int userId);

    Task<ApplicationResponseDto?> GetMyApplicationByIdAsync(
        int userId,
        int applicationId);

    Task<bool> WithdrawAsync(
        int userId,
        int applicationId);

    Task<List<ApplicationResponseDto>> GetApplicantsAsync(
        int userId,
        int jobId);

    Task<ApplicationResponseDto?> UpdateStatusAsync(
        int userId,
        int applicationId,
        string status,
        string? recruiterRemarks);
}