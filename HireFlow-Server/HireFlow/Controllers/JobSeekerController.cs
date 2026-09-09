using HireFlow.DTOs.JobSeeker;
using HireFlow.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using HireFlow.Helpers;

namespace HireFlow.Controllers;

[ApiController]
[Route("api/jobseekers")]
[Authorize(Roles = "JobSeeker")]
public class JobSeekerController : ControllerBase
{
    private readonly IJobSeekerService _jobSeekerService;

    public JobSeekerController(IJobSeekerService jobSeekerService)
    {
        _jobSeekerService = jobSeekerService;
    }


    // POST: api/jobseekers/profile
    [HttpPost("profile")]
    public async Task<IActionResult> CreateProfile(
        CreateJobSeekerProfileDto dto)
    {
        int userId = GetUserId();

        var profile = await _jobSeekerService.CreateAsync(
            userId,
            dto);

        return Ok(profile);
    }


    // GET: api/jobseekers/profile
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        int userId = GetUserId();

        var profile = await _jobSeekerService.GetAsync(userId);

        if (profile == null)
        {
            return NotFound(new
            {
                message = "Job seeker profile not found."
            });
        }

        return Ok(profile);
    }


    // PUT: api/jobseekers/profile
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        UpdateJobSeekerProfileDto dto)
    {
        int userId = GetUserId();

        var profile = await _jobSeekerService.UpdateAsync(
            userId,
            dto);

        if (profile == null)
        {
            return NotFound(new
            {
                message = "Job seeker profile not found."
            });
        }

        return Ok(profile);
    }


    // PATCH: api/jobseekers/profile
    [HttpPatch("profile")]
    public async Task<IActionResult> PatchProfile(
        UpdateJobSeekerProfileDto dto)
    {
        int userId = GetUserId();

        var profile = await _jobSeekerService.PatchAsync(
            userId,
            dto);

        if (profile == null)
        {
            return NotFound(new
            {
                message = "Job seeker profile not found."
            });
        }

        return Ok(profile);
    }


    // DELETE: api/jobseekers/profile
    [HttpDelete("profile")]
    public async Task<IActionResult> DeleteProfile()
    {
        int userId = GetUserId();

        bool deleted = await _jobSeekerService.DeleteAsync(userId);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Job seeker profile not found."
            });
        }

        return Ok(new
        {
            message = "Job seeker profile deleted successfully."
        });
    }


    // Get logged-in user's ID from JWT
    private int GetUserId()
    {
        string? userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        // Our JWT currently uses "sub"
        if (userId == null)
        {
            userId = User.FindFirstValue(
                JwtRegisteredClaimNames.Sub);
        }

        return int.Parse(userId!);
    }

    // POST: api/jobseekers/profile/image
    [HttpPost("profile/image")]
    public async Task<IActionResult> UploadProfileImage(IFormFile file)
    {
        string? validationError = FileValidator.ValidateImage(file);

        if (validationError != null)
        {
            return BadRequest(new
            {
                message = validationError
            });
        }

        int userId = GetUserId();

        var imageUrl = await _jobSeekerService
            .UploadProfileImageAsync(userId, file);

        if (imageUrl == null)
        {
            return NotFound(new
            {
                message = "Job seeker profile not found."
            });
        }

        return Ok(new
        {
            message = "Profile image uploaded successfully.",
            imageUrl
        });
    }

    // POST: api/jobseekers/profile/resume
    [HttpPost("profile/resume")]
    public async Task<IActionResult> UploadResume(IFormFile file)
    {
        string? validationError = FileValidator.ValidateResume(file);

        if (validationError != null)
        {
            return BadRequest(new
            {
                message = validationError
            });
        }

        int userId = GetUserId();

        var resumeUrl = await _jobSeekerService
            .UploadResumeAsync(userId, file);

        if (resumeUrl == null)
        {
            return NotFound(new
            {
                message = "Job seeker profile not found."
            });
        }

        return Ok(new
        {
            message = "Resume uploaded successfully.",
            resumeUrl
        });
    }
}