using HireFlow.Data;
using HireFlow.DTOs.Company;
using HireFlow.Helpers;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class CompanyService : ICompanyService
{
    private readonly ApplicationDbContext _context;
    private readonly ICloudinaryService _cloudinaryService;

    public CompanyService(ApplicationDbContext context, ICloudinaryService cloudinaryService)
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<CompanyResponseDto> CreateAsync(
        int userId,
        CreateCompanyDto dto)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            throw new InvalidOperationException(
                "Recruiter profile not found.");
        }

        if (recruiter.CompanyId != null)
        {
            throw new InvalidOperationException(
                "Recruiter is already associated with a company.");
        }

        var company = new Company
        {
            CompanyName = dto.CompanyName,
            Description = dto.Description,
            Industry = dto.Industry,
            Location = dto.Location,
            Website = dto.Website,
            CompanySize = dto.CompanySize,
            CreatedAt = DateTime.UtcNow
        };

        _context.Companies.Add(company);

        await _context.SaveChangesAsync();

        // Connect recruiter to the newly created company.
        recruiter.CompanyId = company.Id;
        recruiter.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(company);
    }

    public async Task<CompanyResponseDto?> GetAsync(
        int userId)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null || recruiter.CompanyId == null)
        {
            return null;
        }

        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == recruiter.CompanyId);

        if (company == null)
        {
            return null;
        }

        return MapToDto(company);
    }

    public async Task<CompanyResponseDto?> UpdateAsync(
        int userId,
        UpdateCompanyDto dto)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null || recruiter.CompanyId == null)
        {
            return null;
        }

        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == recruiter.CompanyId);

        if (company == null)
        {
            return null;
        }

        company.CompanyName = dto.CompanyName ?? string.Empty;
        company.Description = dto.Description;
        company.Industry = dto.Industry;
        company.Location = dto.Location;
        company.Website = dto.Website;
        company.CompanySize = dto.CompanySize;
        company.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(company);
    }

    public async Task<CompanyResponseDto?> PatchAsync(
        int userId,
        UpdateCompanyDto dto)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null || recruiter.CompanyId == null)
        {
            return null;
        }

        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == recruiter.CompanyId);

        if (company == null)
        {
            return null;
        }

        if (dto.CompanyName != null)
            company.CompanyName = dto.CompanyName;

        if (dto.Description != null)
            company.Description = dto.Description;

        if (dto.Industry != null)
            company.Industry = dto.Industry;

        if (dto.Location != null)
            company.Location = dto.Location;

        if (dto.Website != null)
            company.Website = dto.Website;

        if (dto.CompanySize != null)
            company.CompanySize = dto.CompanySize;

        company.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(company);
    }

    public async Task<bool> DeleteAsync(
        int userId)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null || recruiter.CompanyId == null)
        {
            return false;
        }

        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == recruiter.CompanyId);

        if (company == null)
        {
            return false;
        }

        // Do not delete a company if jobs are associated with it.
        bool hasJobs = await _context.Jobs
            .AnyAsync(j => j.CompanyId == company.Id);

        if (hasJobs)
        {
            throw new InvalidOperationException(
                "Company cannot be deleted because it has jobs.");
        }

        // Remove the relationship first.
        recruiter.CompanyId = null;
        recruiter.UpdatedAt = DateTime.UtcNow;

        _context.Companies.Remove(company);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<string?> UploadLogoAsync(
    int userId,
    IFormFile file)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null || recruiter.CompanyId == null)
        {
            return null;
        }

        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == recruiter.CompanyId);

        if (company == null)
        {
            return null;
        }

        string? validationError = FileValidator.ValidateImage(file);

        if (validationError != null)
        {
            throw new ArgumentException(validationError);
        }

        string logoUrl = await _cloudinaryService
            .UploadCompanyLogoAsync(file);

        company.LogoUrl = logoUrl;
        company.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return logoUrl;
    }

    private static CompanyResponseDto MapToDto(
        Company company)
    {
        return new CompanyResponseDto
        {
            Id = company.Id,
            CompanyName = company.CompanyName,
            Description = company.Description,
            Industry = company.Industry,
            Location = company.Location,
            Website = company.Website,
            CompanySize = company.CompanySize,
            LogoUrl = company.LogoUrl,
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };
    }
}