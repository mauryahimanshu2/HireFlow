using HireFlow.Data;
using HireFlow.DTOs.Job;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class JobService : IJobService
{
    private readonly ApplicationDbContext _context;

    public JobService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<JobResponseDto> CreateAsync(
        int userId,
        CreateJobDto dto)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            throw new InvalidOperationException(
                "Recruiter profile not found.");
        }

        if (recruiter.CompanyId == null)
        {
            throw new InvalidOperationException(
                "Recruiter is not associated with a company.");
        }

        var companyExists = await _context.Companies
            .AnyAsync(c => c.Id == recruiter.CompanyId.Value);

        if (!companyExists)
        {
            throw new InvalidOperationException(
                "Company not found.");
        }

        if (dto.SalaryMin.HasValue &&
            dto.SalaryMax.HasValue &&
            dto.SalaryMin > dto.SalaryMax)
        {
            throw new InvalidOperationException(
                "Minimum salary cannot be greater than maximum salary.");
        }

        var job = new Job
        {
            CompanyId = recruiter.CompanyId.Value,
            RecruiterId = recruiter.Id,

            Title = dto.Title,
            Description = dto.Description,
            Location = dto.Location,
            EmploymentType = dto.EmploymentType,
            ExperienceRequired = dto.ExperienceRequired,
            SalaryMin = dto.SalaryMin,
            SalaryMax = dto.SalaryMax,
            Skills = dto.Skills,

            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Jobs.Add(job);

        await _context.SaveChangesAsync();

        return MapToDto(job);
    }

    public async Task<JobResponseDto?> GetByIdAsync(
        int jobId)
    {
        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == jobId);

        if (job == null)
        {
            return null;
        }

        return MapToDto(job);
    }

    public async Task<List<JobResponseDto>> GetAllAsync(
    JobFilterDto filter)
    {
        var query = _context.Jobs
            .Where(j => j.IsActive)
            .AsQueryable();

        // Keyword filter
        if (!string.IsNullOrWhiteSpace(filter.Keyword))
        {
            string keyword = filter.Keyword.Trim();

            query = query.Where(j =>
                j.Title.Contains(keyword) ||
                j.Description.Contains(keyword) ||
                (j.Skills != null && j.Skills.Contains(keyword)));
        }

        // Location filter
        if (!string.IsNullOrWhiteSpace(filter.Location))
        {
            string location = filter.Location.Trim();

            query = query.Where(j =>
                j.Location != null &&
                j.Location.Contains(location));
        }

        // Employment type filter
        if (!string.IsNullOrWhiteSpace(filter.EmploymentType))
        {
            string employmentType = filter.EmploymentType.Trim();

            query = query.Where(j =>
                j.EmploymentType != null &&
                j.EmploymentType == employmentType);
        }

        // Minimum salary filter
        if (filter.MinSalary.HasValue)
        {
            query = query.Where(j =>
                j.SalaryMax.HasValue &&
                j.SalaryMax >= filter.MinSalary.Value);
        }

        // Maximum salary filter
        if (filter.MaxSalary.HasValue)
        {
            query = query.Where(j =>
                j.SalaryMin.HasValue &&
                j.SalaryMin <= filter.MaxSalary.Value);
        }

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();

        return jobs
            .Select(MapToDto)
            .ToList();
    }

    public async Task<JobResponseDto?> UpdateAsync(
        int userId,
        int jobId,
        UpdateJobDto dto)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            return null;
        }

        var job = await _context.Jobs
            .FirstOrDefaultAsync(j =>
                j.Id == jobId &&
                j.RecruiterId == recruiter.Id);

        if (job == null)
        {
            return null;
        }

        if (dto.SalaryMin.HasValue &&
            dto.SalaryMax.HasValue &&
            dto.SalaryMin > dto.SalaryMax)
        {
            throw new InvalidOperationException(
                "Minimum salary cannot be greater than maximum salary.");
        }

        job.Title = dto.Title ?? string.Empty;
        job.Description = dto.Description ?? string.Empty;
        job.Location = dto.Location;
        job.EmploymentType = dto.EmploymentType;
        job.ExperienceRequired = dto.ExperienceRequired;
        job.SalaryMin = dto.SalaryMin;
        job.SalaryMax = dto.SalaryMax;
        job.Skills = dto.Skills;

        if (dto.IsActive.HasValue)
        {
            job.IsActive = dto.IsActive.Value;
        }

        job.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(job);
    }

    public async Task<JobResponseDto?> PatchAsync(
        int userId,
        int jobId,
        UpdateJobDto dto)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            return null;
        }

        var job = await _context.Jobs
            .FirstOrDefaultAsync(j =>
                j.Id == jobId &&
                j.RecruiterId == recruiter.Id);

        if (job == null)
        {
            return null;
        }

        if (dto.SalaryMin.HasValue &&
            dto.SalaryMax.HasValue &&
            dto.SalaryMin > dto.SalaryMax)
        {
            throw new InvalidOperationException(
                "Minimum salary cannot be greater than maximum salary.");
        }

        if (dto.Title != null)
        {
            job.Title = dto.Title;
        }

        if (dto.Description != null)
        {
            job.Description = dto.Description;
        }

        if (dto.Location != null)
        {
            job.Location = dto.Location;
        }

        if (dto.EmploymentType != null)
        {
            job.EmploymentType = dto.EmploymentType;
        }

        if (dto.ExperienceRequired != null)
        {
            job.ExperienceRequired = dto.ExperienceRequired;
        }

        if (dto.SalaryMin.HasValue)
        {
            job.SalaryMin = dto.SalaryMin;
        }

        if (dto.SalaryMax.HasValue)
        {
            job.SalaryMax = dto.SalaryMax;
        }

        if (dto.Skills != null)
        {
            job.Skills = dto.Skills;
        }

        if (dto.IsActive.HasValue)
        {
            job.IsActive = dto.IsActive.Value;
        }

        job.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(job);
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int jobId)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            return false;
        }

        var job = await _context.Jobs
            .FirstOrDefaultAsync(j =>
                j.Id == jobId &&
                j.RecruiterId == recruiter.Id);

        if (job == null)
        {
            return false;
        }

        bool hasApplications = await _context.JobApplications
            .AnyAsync(a => a.JobId == jobId);

        if (hasApplications)
        {
            throw new InvalidOperationException(
                "Job cannot be deleted because applications exist.");
        }

        _context.Jobs.Remove(job);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<JobResponseDto>> GetMyJobsAsync(int userId)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            return new List<JobResponseDto>();
        }

        var jobs = await _context.Jobs
            .Where(j => j.RecruiterId == recruiter.Id)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();

        return jobs
            .Select(MapToDto)
            .ToList();
    }

    private static JobResponseDto MapToDto(Job job)
    {
        return new JobResponseDto
        {
            Id = job.Id,
            CompanyId = job.CompanyId,
            RecruiterId = job.RecruiterId,
            Title = job.Title,
            Description = job.Description,
            Location = job.Location,
            EmploymentType = job.EmploymentType,
            ExperienceRequired = job.ExperienceRequired,
            SalaryMin = job.SalaryMin,
            SalaryMax = job.SalaryMax,
            Skills = job.Skills,
            IsActive = job.IsActive,
            CreatedAt = job.CreatedAt,
            UpdatedAt = job.UpdatedAt
        };
    }
}