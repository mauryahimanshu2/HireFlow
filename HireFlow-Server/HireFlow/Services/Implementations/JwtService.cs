using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace HireFlow.Services.Implementations;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var key = _configuration["Jwt:Key"];

        if (string.IsNullOrEmpty(key))
        {
            throw new InvalidOperationException("JWT Key is not configured.");
        }

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key)
        );

        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256
        );

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),

            new Claim(
                JwtRegisteredClaimNames.Email,
                user.Email
            ),

            new Claim(
                ClaimTypes.Name,
                user.Name
            ),

            new Claim(
                ClaimTypes.Role,
                user.Role
            )
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}