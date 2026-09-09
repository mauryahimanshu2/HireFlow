using HireFlow.Data;
using HireFlow.DTOs.Recruiter;
using HireFlow.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

[ApiController]
[Route("api/recruiters")]
[Authorize(Roles = "Recruiter")]
public class RecruiterController : ControllerBase
{
    private readonly IRecruiterService _recruiterService;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ApplicationDbContext _context;

    public RecruiterController(
        IRecruiterService recruiterService,
        ICloudinaryService cloudinaryService,
        ApplicationDbContext context)
    {
        _recruiterService = recruiterService;
        _cloudinaryService = cloudinaryService;
        _context = context;
    }

    [HttpPost("profile")]
    public async Task<IActionResult> CreateProfile(
        CreateRecruiterProfileDto dto)
    {
        int userId = GetUserId();

        var profile = await _recruiterService
            .CreateAsync(userId, dto);

        return Ok(profile);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        int userId = GetUserId();

        var profile = await _recruiterService
            .GetAsync(userId);

        if (profile == null)
        {
            return NotFound(new
            {
                message = "Recruiter profile not found."
            });
        }

        return Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        UpdateRecruiterProfileDto dto)
    {
        int userId = GetUserId();

        var profile = await _recruiterService
            .UpdateAsync(userId, dto);

        if (profile == null)
        {
            return NotFound(new
            {
                message = "Recruiter profile not found."
            });
        }

        return Ok(profile);
    }

    [HttpPatch("profile")]
    public async Task<IActionResult> PatchProfile(
        UpdateRecruiterProfileDto dto)
    {
        int userId = GetUserId();

        var profile = await _recruiterService
            .PatchAsync(userId, dto);

        if (profile == null)
        {
            return NotFound(new
            {
                message = "Recruiter profile not found."
            });
        }

        return Ok(profile);
    }

    [HttpDelete("profile")]
    public async Task<IActionResult> DeleteProfile()
    {
        int userId = GetUserId();

        bool deleted = await _recruiterService
            .DeleteAsync(userId);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Recruiter profile not found."
            });
        }

        return Ok(new
        {
            message = "Recruiter profile deleted successfully."
        });
    }

    [HttpPost("profile/image")]
    public async Task<IActionResult> UploadProfileImage(IFormFile file)
    {
        int userId = GetUserId();

        var profile = await _context.RecruiterProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        var imageUrl = await _cloudinaryService.UploadImageAsync(file);

        if (profile == null)
        {
            string? userName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue(JwtRegisteredClaimNames.Name);
            profile = new HireFlow.Models.RecruiterProfile
            {
                UserId = userId,
                FullName = string.IsNullOrWhiteSpace(userName) ? "Recruiter" : userName,
                ProfileImageUrl = imageUrl,
                CreatedAt = DateTime.UtcNow
            };
            _context.RecruiterProfiles.Add(profile);
        }
        else
        {
            profile.ProfileImageUrl = imageUrl;
            profile.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Profile image uploaded successfully.",
            profileImageUrl = imageUrl
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