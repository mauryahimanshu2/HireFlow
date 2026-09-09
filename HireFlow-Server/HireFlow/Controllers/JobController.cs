using HireFlow.DTOs.Job;
using HireFlow.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HireFlow.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobController(IJobService jobService)
    {
        _jobService = jobService;
    }

    // Recruiter creates a job
    [HttpPost]
    [Authorize(Roles = "Recruiter")]
    public async Task<IActionResult> CreateJob(
        CreateJobDto dto)
    {
        int userId = GetUserId();

        var job = await _jobService
            .CreateAsync(userId, dto);

        return Ok(job);
    }

    // Anyone authenticated can view a single job
    [HttpGet("{jobId:int}")]
    [Authorize]
    public async Task<IActionResult> GetJob(
        int jobId)
    {
        var job = await _jobService
            .GetByIdAsync(jobId);

        if (job == null)
        {
            return NotFound(new
            {
                message = "Job not found."
            });
        }

        return Ok(job);
    }

    // Anyone authenticated can view active jobs
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAllJobs([FromQuery] JobFilterDto dto)
    {
        var jobs = await _jobService
            .GetAllAsync(   dto);

        return Ok(jobs);
    }

    // Recruiter views their own posted jobs
    [HttpGet("my")]
    [Authorize(Roles = "Recruiter")]
    public async Task<IActionResult> GetMyJobs()
    {
        int userId = GetUserId();

        var jobs = await _jobService
            .GetMyJobsAsync(userId);

        return Ok(jobs);
    }

    // Recruiter updates their own job
    [HttpPut("{jobId:int}")]
    [Authorize(Roles = "Recruiter")]
    public async Task<IActionResult> UpdateJob(
        int jobId,
        UpdateJobDto dto)
    {
        int userId = GetUserId();

        var job = await _jobService
            .UpdateAsync(userId, jobId, dto);

        if (job == null)
        {
            return NotFound(new
            {
                message = "Job not found or you do not have permission to modify it."
            });
        }

        return Ok(job);
    }

    // Recruiter partially updates their own job
    [HttpPatch("{jobId:int}")]
    [Authorize(Roles = "Recruiter")]
    public async Task<IActionResult> PatchJob(
        int jobId,
        UpdateJobDto dto)
    {
        int userId = GetUserId();

        var job = await _jobService
            .PatchAsync(userId, jobId, dto);

        if (job == null)
        {
            return NotFound(new
            {
                message = "Job not found or you do not have permission to modify it."
            });
        }

        return Ok(job);
    }

    // Recruiter deletes their own job
    [HttpDelete("{jobId:int}")]
    [Authorize(Roles = "Recruiter")]
    public async Task<IActionResult> DeleteJob(
        int jobId)
    {
        int userId = GetUserId();

        bool deleted = await _jobService
            .DeleteAsync(userId, jobId);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Job not found or you do not have permission to delete it."
            });
        }

        return Ok(new
        {
            message = "Job deleted successfully."
        });
    }

    private int GetUserId()
    {
        string? userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            userId = User.FindFirstValue(
                JwtRegisteredClaimNames.Sub);
        }

        return int.Parse(userId!);
    }
}