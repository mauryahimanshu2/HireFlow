using HireFlow.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HireFlow.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    // Get all users
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _adminService.GetUsersAsync();

        return Ok(users);
    }

    // Block user
    [HttpPatch("users/{userId:int}/block")]
    public async Task<IActionResult> BlockUser(int userId)
    {
        bool result = await _adminService.BlockUserAsync(userId);

        if (!result)
        {
            return BadRequest(new
            {
                message = "User not found, already blocked, or user is an Admin."
            });
        }

        return Ok(new
        {
            message = "User blocked successfully."
        });
    }

    // Unblock user
    [HttpPatch("users/{userId:int}/unblock")]
    public async Task<IActionResult> UnblockUser(int userId)
    {
        bool result = await _adminService.UnblockUserAsync(userId);

        if (!result)
        {
            return BadRequest(new
            {
                message = "User not found or user is not blocked."
            });
        }

        return Ok(new
        {
            message = "User unblocked successfully."
        });
    }


    // Get all jobs
    [HttpGet("jobs")]
    public async Task<IActionResult> GetJobs()
    {
        var jobs = await _adminService.GetJobsAsync();

        return Ok(jobs);
    }

    // Activate job
    [HttpPatch("jobs/{jobId:int}/activate")]
    public async Task<IActionResult> ActivateJob(int jobId)
    {
        bool result = await _adminService.ActivateJobAsync(jobId);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Job not found or job is already active."
            });
        }

        return Ok(new
        {
            message = "Job activated successfully."
        });
    }

    // Deactivate job
    [HttpPatch("jobs/{jobId:int}/deactivate")]
    public async Task<IActionResult> DeactivateJob(int jobId)
    {
        bool result = await _adminService.DeactivateJobAsync(jobId);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Job not found or job is already inactive."
            });
        }

        return Ok(new
        {
            message = "Job deactivated successfully."
        });
    }

    // Get dashboard statistics
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _adminService.GetStatsAsync();

        return Ok(stats);
    }
}
