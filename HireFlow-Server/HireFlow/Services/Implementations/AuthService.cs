using HireFlow.Data;
using HireFlow.DTOs.Auth;
using HireFlow.Helpers;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(
        ApplicationDbContext context,
        PasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<(bool Success, string Message)> RegisterAsync(
        RegisterDto dto)
    {
        string role = dto.Role.Trim();

        if (!string.Equals(
                role,
                "JobSeeker",
                StringComparison.OrdinalIgnoreCase) &&
            !string.Equals(
                role,
                "Recruiter",
                StringComparison.OrdinalIgnoreCase))
        {
            return (
                false,
                "Invalid role. Only JobSeeker or Recruiter registration is allowed."
            );
        }

        role = string.Equals(
            role,
            "JobSeeker",
            StringComparison.OrdinalIgnoreCase)
            ? "JobSeeker"
            : "Recruiter";

        string email = dto.Email.Trim().ToLowerInvariant();

        bool emailExists = await _context.Users
            .AnyAsync(u => u.Email == email);

        if (emailExists)
        {
            return (
                false,
                "Email already exists."
            );
        }

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = email,
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            Role = role,
            IsBlocked = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return (
            true,
            "Registration successful."
        );
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        string email = dto.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            return null;
        }

        if (user.IsBlocked)
        {
            return null;
        }

        bool passwordValid = _passwordHasher.VerifyPassword(
            dto.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return null;
        }

        return new LoginResponseDto
        {
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Token = _jwtService.GenerateToken(user)
        };
    }
}