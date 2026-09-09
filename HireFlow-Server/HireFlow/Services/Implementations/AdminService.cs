using HireFlow.Data;
using HireFlow.DTOs.Admin;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;

    public AdminService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminUserResponseDto>> GetUsersAsync()
    {
        return await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new AdminUserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                IsBlocked = u.IsBlocked,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> BlockUserAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return false;
        }

        // Admin cannot block another Admin
        if (user.Role == "Admin")
        {
            return false;
        }

        if (user.IsBlocked)
        {
            return false;
        }

        user.IsBlocked = true;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UnblockUserAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return false;
        }

        if (!user.IsBlocked)
        {
            return false;
        }

        user.IsBlocked = false;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<AdminJobResponseDto>> GetJobsAsync()
    {
        return await _context.Jobs
            .Include(j => j.Company)
            .Include(j => j.Recruiter)
                .ThenInclude(r => r.User)
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new AdminJobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Location = j.Location,
                EmploymentType = j.EmploymentType,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                IsActive = j.IsActive,
                CreatedAt = j.CreatedAt,

                CompanyId = j.CompanyId,
                CompanyName = j.Company.CompanyName,

                RecruiterId = j.RecruiterId,
                RecruiterName = j.Recruiter.FullName
            })
            .ToListAsync();
    }

    public async Task<bool> ActivateJobAsync(int jobId)
    {
        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == jobId);

        if (job == null)
        {
            return false;
        }

        if (job.IsActive)
        {
            return false;
        }

        job.IsActive = true;
        job.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeactivateJobAsync(int jobId)
    {
        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == jobId);

        if (job == null)
        {
            return false;
        }

        if (!job.IsActive)
        {
            return false;
        }

        job.IsActive = false;
        job.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }


    public async Task<AdminStatsResponseDto> GetStatsAsync()
    {
        int totalUsers = await _context.Users.CountAsync();

        int totalJobSeekers = await _context.Users
            .CountAsync(u => u.Role == "JobSeeker");

        int totalRecruiters = await _context.Users
            .CountAsync(u => u.Role == "Recruiter");

        int totalJobs = await _context.Jobs.CountAsync();

        int activeJobs = await _context.Jobs
            .CountAsync(j => j.IsActive);

        int inactiveJobs = await _context.Jobs
            .CountAsync(j => !j.IsActive);

        int totalApplications = await _context.JobApplications
            .CountAsync();

        return new AdminStatsResponseDto
        {
            TotalUsers = totalUsers,
            TotalJobSeekers = totalJobSeekers,
            TotalRecruiters = totalRecruiters,
            TotalJobs = totalJobs,
            ActiveJobs = activeJobs,
            InactiveJobs = inactiveJobs,
            TotalApplications = totalApplications
        };
    }
}