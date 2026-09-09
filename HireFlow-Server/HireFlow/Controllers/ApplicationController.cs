using HireFlow.DTOs.Application;
using HireFlow.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HireFlow.Controllers;

[ApiController]
[Route("api/applications")]
public class ApplicationController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    // Job Seeker: Apply for a job
    [HttpPost]
    [Authorize(Roles = "JobSeeker")]
    public async Task<IActionResult> Apply(CreateApplicationDto dto)
    {
        int userId = GetUserId();

        var application = await _applicationService.ApplyAsync(
            userId,
            dto);

        return Ok(application);
    }

    // Job Seeker: Get all my applications
    [HttpGet("my")]
    [Authorize(Roles = "JobSeeker")]
    public async Task<IActionResult> GetMyApplications()
    {
        int userId = GetUserId();

        var applications =
            await _applicationService.GetMyApplicationsAsync(userId);

        return Ok(applications);
    }

    // Job Seeker: Get one of my applications
    [HttpGet("my/{applicationId:int}")]
    [Authorize(Roles = "JobSeeker")]
    public async Task<IActionResult> GetMyApplication(
        int applicationId)
    {
        int userId = GetUserId();

        var application =
            await _applicationService.GetMyApplicationByIdAsync(
                userId,
                applicationId);

        if (application == null)
        {
            return NotFound(new
            {
                message = "Application not found."
            });
        }

        return Ok(application);
    }

    // Job Seeker: Withdraw application
    [HttpPatch("{applicationId:int}/withdraw")]
    [Authorize(Roles = "JobSeeker")]
    public async Task<IActionResult> Withdraw(
        int applicationId)
    {
        int userId = GetUserId();

        bool result =
            await _applicationService.WithdrawAsync(
                userId,
                applicationId);

        if (!result)
        {
            return NotFound(new
            {
                message = "Application not found or already withdrawn."
            });
        }

        return Ok(new
        {
            message = "Application withdrawn successfully."
        });
    }

    // Recruiter: View applicants for a job
    [HttpGet("job/{jobId:int}/applicants")]
    [Authorize(Roles = "Recruiter")]
    public async Task<IActionResult> GetApplicants(
        int jobId)
    {
        int userId = GetUserId();

        var applicants =
            await _applicationService.GetApplicantsAsync(
                userId,
                jobId);

        return Ok(applicants);
    }

    // Recruiter: Update application status
    [HttpPatch("{applicationId:int}/status")]
    [Authorize(Roles = "Recruiter")]
    public async Task<IActionResult> UpdateStatus(
        int applicationId,
        string status,
        string? recruiterRemarks)
    {
        int userId = GetUserId();

        var application =
            await _applicationService.UpdateStatusAsync(
                userId,
                applicationId,
                status,
                recruiterRemarks);

        if (application == null)
        {
            return NotFound(new
            {
                message = "Application not found or you do not have permission."
            });
        }

        return Ok(application);
    }

    private int GetUserId()
    {
        string? userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            userId =
                User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        }

        return int.Parse(userId!);
    }
}