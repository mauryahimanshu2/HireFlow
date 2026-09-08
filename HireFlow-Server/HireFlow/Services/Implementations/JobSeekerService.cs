using HireFlow.Data;
using HireFlow.DTOs.JobSeeker;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class JobSeekerService : IJobSeekerService
{
    private readonly ApplicationDbContext _context;

    public JobSeekerService(ApplicationDbContext context)
    {
        _context = context;
    }

    // CREATE
    public async Task<JobSeekerProfileDto> CreateAsync(
        int userId,
        CreateJobSeekerProfileDto dto)
    {
        // Check whether profile already exists
        var existingProfile = await _context.JobSeekerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (existingProfile != null)
        {
            throw new InvalidOperationException(
                "Job seeker profile already exists.");
        }

        var profile = new JobSeekerProfile
        {
            UserId = userId,
            FullName = dto.FullName,
            Phone = dto.Phone,
            Location = dto.Location,
            Skills = dto.Skills,
            Education = dto.Education,
            Experience = dto.Experience,
            CreatedAt = DateTime.UtcNow
        };

        _context.JobSeekerProfiles.Add(profile);

        await _context.SaveChangesAsync();

        return MapToDto(profile);
    }


    // GET
    public async Task<JobSeekerProfileDto?> GetAsync(int userId)
    {
        var profile = await _context.JobSeekerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            return null;
        }

        return MapToDto(profile);
    }


    // PUT
    public async Task<JobSeekerProfileDto?> UpdateAsync(
        int userId,
        UpdateJobSeekerProfileDto dto)
    {
        var profile = await _context.JobSeekerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            return null;
        }

        profile.FullName = dto.FullName ?? string.Empty;
        profile.Phone = dto.Phone;
        profile.Location = dto.Location;
        profile.Skills = dto.Skills;
        profile.Education = dto.Education;
        profile.Experience = dto.Experience;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(profile);
    }


    // PATCH
    public async Task<JobSeekerProfileDto?> PatchAsync(
        int userId,
        UpdateJobSeekerProfileDto dto)
    {
        var profile = await _context.JobSeekerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            return null;
        }

        // Only update fields that were provided
        if (dto.FullName != null)
            profile.FullName = dto.FullName;

        if (dto.Phone != null)
            profile.Phone = dto.Phone;

        if (dto.Location != null)
            profile.Location = dto.Location;

        if (dto.Skills != null)
            profile.Skills = dto.Skills;

        if (dto.Education != null)
            profile.Education = dto.Education;

        if (dto.Experience != null)
            profile.Experience = dto.Experience;

        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(profile);
    }


    // DELETE
    public async Task<bool> DeleteAsync(int userId)
    {
        var profile = await _context.JobSeekerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            return false;
        }

        _context.JobSeekerProfiles.Remove(profile);

        await _context.SaveChangesAsync();

        return true;
    }


    // Mapping Entity -> DTO
    private static JobSeekerProfileDto MapToDto(
        JobSeekerProfile profile)
    {
        return new JobSeekerProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            FullName = profile.FullName,
            Phone = profile.Phone,
            Location = profile.Location,
            Skills = profile.Skills,
            Education = profile.Education,
            Experience = profile.Experience,
            ProfileImageUrl = profile.ProfileImageUrl,
            ResumeUrl = profile.ResumeUrl,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }
}