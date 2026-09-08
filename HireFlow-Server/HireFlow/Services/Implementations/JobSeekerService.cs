using HireFlow.Data;
using HireFlow.DTOs.JobSeeker;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class JobSeekerService : IJobSeekerService
{
    private readonly ApplicationDbContext _context;

    private readonly ICloudinaryService _cloudinaryService;

    public JobSeekerService(ApplicationDbContext context, ICloudinaryService cloudinaryService)
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
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
        var user = await _context.Users
            .Include(u => u.JobSeekerProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return false;
        }

        var profile = user.JobSeekerProfile;

        if (profile != null)
        {
            // Delete job applications first
            var applications = await _context.JobApplications
                .Where(a => a.JobSeekerId == profile.Id)
                .ToListAsync();

            _context.JobApplications.RemoveRange(applications);

            // Delete job seeker profile
            _context.JobSeekerProfiles.Remove(profile);
        }

        // Delete user account
        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return true;
    }

    // Upload Profile Image
    public async Task<string?> UploadProfileImageAsync(
    int userId,
    IFormFile file)
    {
        var profile = await _context.JobSeekerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            return null;
        }

        string imageUrl = await _cloudinaryService
            .UploadImageAsync(file);

        profile.ProfileImageUrl = imageUrl;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return imageUrl;
    }

    // Upload Resume
    public async Task<string?> UploadResumeAsync(
    int userId,
    IFormFile file)
    {
        var profile = await _context.JobSeekerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            return null;
        }

        string resumeUrl = await _cloudinaryService
            .UploadResumeAsync(file);

        profile.ResumeUrl = resumeUrl;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return resumeUrl;
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