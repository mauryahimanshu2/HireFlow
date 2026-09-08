using HireFlow.DTOs.Recruiter;

namespace HireFlow.Services.Interfaces;

public interface IRecruiterService
{
    Task<RecruiterProfileDto> CreateAsync(
        int userId,
        CreateRecruiterProfileDto dto);

    Task<RecruiterProfileDto?> GetAsync(
        int userId);

    Task<RecruiterProfileDto?> UpdateAsync(
        int userId,
        UpdateRecruiterProfileDto dto);

    Task<RecruiterProfileDto?> PatchAsync(
        int userId,
        UpdateRecruiterProfileDto dto);

    Task<bool> DeleteAsync(
        int userId);
}