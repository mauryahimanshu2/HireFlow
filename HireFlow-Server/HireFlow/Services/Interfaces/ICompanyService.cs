using HireFlow.DTOs.Company;

namespace HireFlow.Services.Interfaces;

public interface ICompanyService
{
    Task<CompanyResponseDto> CreateAsync(
        int userId,
        CreateCompanyDto dto);

    Task<CompanyResponseDto?> GetAsync(
        int userId);

    Task<CompanyResponseDto?> UpdateAsync(
        int userId,
        UpdateCompanyDto dto);

    Task<CompanyResponseDto?> PatchAsync(
        int userId,
        UpdateCompanyDto dto);

    Task<bool> DeleteAsync(
        int userId);

    Task<string?> UploadLogoAsync(
    int userId,
    IFormFile file);
}