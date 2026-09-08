using HireFlow.Data;
using HireFlow.DTOs.Recruiter;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class RecruiterService : IRecruiterService
{
    private readonly ApplicationDbContext _context;

    public RecruiterService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RecruiterProfileDto> CreateAsync(
        int userId,
        CreateRecruiterProfileDto dto)
    {
        var existingProfile = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (existingProfile != null)
        {
            throw new InvalidOperationException(
                "Recruiter profile already exists.");
        }

        // If CompanyId is provided, make sure the company exists.
        if (dto.CompanyId.HasValue)
        {
            bool companyExists = await _context.Companies
                .AnyAsync(c => c.Id == dto.CompanyId.Value);

            if (!companyExists)
            {
                throw new InvalidOperationException(
                    "Company not found.");
            }
        }

        var profile = new RecruiterProfile
        {
            UserId = userId,
            FullName = dto.FullName,
            Phone = dto.Phone,
            Designation = dto.Designation,
            CompanyId = dto.CompanyId,
            CreatedAt = DateTime.UtcNow
        };

        _context.RecruiterProfiles.Add(profile);

        await _context.SaveChangesAsync();

        return MapToDto(profile);
    }

    public async Task<RecruiterProfileDto?> GetAsync(
        int userId)
    {
        var profile = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (profile == null)
        {
            return null;
        }

        return MapToDto(profile);
    }

    public async Task<RecruiterProfileDto?> UpdateAsync(
        int userId,
        UpdateRecruiterProfileDto dto)
    {
        var profile = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (profile == null)
        {
            return null;
        }

        // If CompanyId is provided, verify the company exists.
        if (dto.CompanyId.HasValue)
        {
            bool companyExists = await _context.Companies
                .AnyAsync(c => c.Id == dto.CompanyId.Value);

            if (!companyExists)
            {
                throw new InvalidOperationException(
                    "Company not found.");
            }
        }

        profile.FullName = dto.FullName ?? string.Empty;
        profile.Phone = dto.Phone;
        profile.Designation = dto.Designation;
        profile.CompanyId = dto.CompanyId;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(profile);
    }

    public async Task<RecruiterProfileDto?> PatchAsync(
        int userId,
        UpdateRecruiterProfileDto dto)
    {
        var profile = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (profile == null)
        {
            return null;
        }

        // Only validate CompanyId when it is supplied.
        if (dto.CompanyId.HasValue)
        {
            bool companyExists = await _context.Companies
                .AnyAsync(c => c.Id == dto.CompanyId.Value);

            if (!companyExists)
            {
                throw new InvalidOperationException(
                    "Company not found.");
            }
        }

        if (dto.FullName != null)
        {
            profile.FullName = dto.FullName;
        }

        if (dto.Phone != null)
        {
            profile.Phone = dto.Phone;
        }

        if (dto.Designation != null)
        {
            profile.Designation = dto.Designation;
        }

        if (dto.CompanyId.HasValue)
        {
            profile.CompanyId = dto.CompanyId;
        }

        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(profile);
    }

    public async Task<bool> DeleteAsync(
        int userId)
    {
        var user = await _context.Users
            .Include(u => u.RecruiterProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return false;
        }

        var profile = user.RecruiterProfile;

        if (profile != null)
        {
            _context.RecruiterProfiles.Remove(profile);
        }

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return true;
    }

    private static RecruiterProfileDto MapToDto(
        RecruiterProfile profile)
    {
        return new RecruiterProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            FullName = profile.FullName,
            Phone = profile.Phone,
            Designation = profile.Designation,
            CompanyId = profile.CompanyId,
            ProfileImageUrl = profile.ProfileImageUrl,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }
}