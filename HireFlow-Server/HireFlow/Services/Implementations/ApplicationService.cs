using HireFlow.Data;
using HireFlow.DTOs.Application;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class ApplicationService : IApplicationService
{
    private readonly ApplicationDbContext _context;

    public ApplicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApplicationResponseDto> ApplyAsync(
        int userId,
        CreateApplicationDto dto)
    {
        // Find Job Seeker profile
        var jobSeeker = await _context.JobSeekerProfiles
            .Include(js => js.User)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (jobSeeker == null)
        {
            throw new InvalidOperationException(
                "Job seeker profile not found.");
        }

        // Find active job
        var job = await _context.Jobs
            .Include(j => j.Company)
            .FirstOrDefaultAsync(j =>
                j.Id == dto.JobId &&
                j.IsActive);

        if (job == null)
        {
            throw new InvalidOperationException(
                "Job not found or is no longer active.");
        }

        // Check duplicate application
        bool alreadyApplied = await _context.JobApplications
            .AnyAsync(a =>
                a.JobId == dto.JobId &&
                a.JobSeekerId == jobSeeker.Id);

        if (alreadyApplied)
        {
            throw new InvalidOperationException(
                "You have already applied for this job.");
        }

        var application = new JobApplication
        {
            JobId = job.Id,
            JobSeekerId = jobSeeker.Id,
            Status = "Applied",
            AppliedAt = DateTime.UtcNow
        };

        _context.JobApplications.Add(application);

        await _context.SaveChangesAsync();

        return MapToDto(application);
    }

    public async Task<List<ApplicationResponseDto>> GetMyApplicationsAsync(
        int userId)
    {
        var applications = await _context.JobApplications
            .Include(a => a.Job)
                .ThenInclude(j => j.Company)
            .Include(a => a.JobSeeker)
                .ThenInclude(js => js.User)
            .Where(a => a.JobSeeker.UserId == userId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        return applications
            .Select(MapToDto)
            .ToList();
    }

    public async Task<ApplicationResponseDto?> GetMyApplicationByIdAsync(
        int userId,
        int applicationId)
    {
        var application = await _context.JobApplications
            .Include(a => a.Job)
                .ThenInclude(j => j.Company)
            .Include(a => a.JobSeeker)
                .ThenInclude(js => js.User)
            .FirstOrDefaultAsync(a =>
                a.Id == applicationId &&
                a.JobSeeker.UserId == userId);

        if (application == null)
        {
            return null;
        }

        return MapToDto(application);
    }

    public async Task<bool> WithdrawAsync(
        int userId,
        int applicationId)
    {
        var application = await _context.JobApplications
            .Include(a => a.JobSeeker)
            .FirstOrDefaultAsync(a =>
                a.Id == applicationId &&
                a.JobSeeker.UserId == userId);

        if (application == null)
        {
            return false;
        }

        if (application.Status == "Withdrawn")
        {
            return false;
        }

        if (application.Status == "Rejected" ||
            application.Status == "Selected")
        {
            throw new InvalidOperationException(
                "This application cannot be withdrawn.");
        }

        application.Status = "Withdrawn";
        application.WithdrawnAt = DateTime.UtcNow;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<ApplicationResponseDto>> GetApplicantsAsync(
        int userId,
        int jobId)
    {
        // Find recruiter
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            return new List<ApplicationResponseDto>();
        }

        // Make sure recruiter owns this job
        var jobExists = await _context.Jobs
            .AnyAsync(j =>
                j.Id == jobId &&
                j.RecruiterId == recruiter.Id);

        if (!jobExists)
        {
            return new List<ApplicationResponseDto>();
        }

        var applications = await _context.JobApplications
            .Include(a => a.Job)
                .ThenInclude(j => j.Company)
            .Include(a => a.JobSeeker)
                .ThenInclude(js => js.User)
            .Where(a => a.JobId == jobId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        return applications
            .Select(MapToDto)
            .ToList();
    }

    public async Task<List<ApplicationResponseDto>> GetAllRecruiterApplicationsAsync(
        int userId)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            return new List<ApplicationResponseDto>();
        }

        var applications = await _context.JobApplications
            .Include(a => a.Job)
                .ThenInclude(j => j.Company)
            .Include(a => a.JobSeeker)
                .ThenInclude(js => js.User)
            .Where(a => a.Job.RecruiterId == recruiter.Id)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        return applications
            .Select(MapToDto)
            .ToList();
    }

    public async Task<ApplicationResponseDto?> UpdateStatusAsync(
        int userId,
        int applicationId,
        string status,
        string? recruiterRemarks)
    {
        var recruiter = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
        {
            return null;
        }

        var application = await _context.JobApplications
            .Include(a => a.Job)
                .ThenInclude(j => j.Company)
            .Include(a => a.JobSeeker)
                .ThenInclude(js => js.User)
            .FirstOrDefaultAsync(a =>
                a.Id == applicationId &&
                a.Job.RecruiterId == recruiter.Id);

        if (application == null)
        {
            return null;
        }

        string rawStatus = (status ?? "").Trim();
        string normalizedStatus = rawStatus.Replace(" ", "").Replace("_", "");

        var allowedStatuses = new[]
        {
            "Applied",
            "UnderReview",
            "Shortlisted",
            "Interview",
            "Selected",
            "Rejected",
            "Withdrawn"
        };

        var matchedStatus = allowedStatuses.FirstOrDefault(s =>
            string.Equals(s, normalizedStatus, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(s, rawStatus, StringComparison.OrdinalIgnoreCase));

        if (matchedStatus == null)
        {
            throw new InvalidOperationException(
                $"Invalid application status: '{status}'. Valid statuses are: {string.Join(", ", allowedStatuses)}.");
        }

        application.Status = matchedStatus;
        application.RecruiterRemarks = recruiterRemarks;
        application.UpdatedAt = DateTime.UtcNow;

        if (matchedStatus == "Withdrawn")
        {
            application.WithdrawnAt ??= DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return MapToDto(application);
    }

    private static ApplicationResponseDto MapToDto(
        JobApplication application)
    {
        return new ApplicationResponseDto
        {
            Id = application.Id,

            JobId = application.JobId,
            JobTitle = application.Job?.Title ?? string.Empty,

            CompanyId = application.Job?.CompanyId ?? 0,
            CompanyName = application.Job?.Company?.CompanyName ?? string.Empty,

            JobSeekerId = application.JobSeekerId,
            JobSeekerName = application.JobSeeker?.FullName ?? string.Empty,
            JobSeekerEmail = application.JobSeeker?.User?.Email,
            JobSeekerPhone = application.JobSeeker?.Phone,
            JobSeekerLocation = application.JobSeeker?.Location,
            JobSeekerSkills = application.JobSeeker?.Skills,
            JobSeekerEducation = application.JobSeeker?.Education,
            JobSeekerExperience = application.JobSeeker?.Experience,
            JobSeekerProfileImageUrl = application.JobSeeker?.ProfileImageUrl,
            JobSeekerResumeUrl = application.JobSeeker?.ResumeUrl,

            Status = application.Status,
            AppliedAt = application.AppliedAt,
            WithdrawnAt = application.WithdrawnAt,
            RecruiterRemarks = application.RecruiterRemarks,
            UpdatedAt = application.UpdatedAt
        };
    }
}