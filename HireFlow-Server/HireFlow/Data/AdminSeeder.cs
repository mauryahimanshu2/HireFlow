using HireFlow.Helpers;
using HireFlow.Models;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Data;

public static class AdminSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context,
        PasswordHasher passwordHasher)
    {
        bool adminExists = await context.Users
            .AnyAsync(u => u.Role == "Admin");

        if (adminExists)
        {
            return;
        }

        var admin = new User
        {
            Name = "System Admin",
            Email = "admin@hireflow.com",
            PasswordHash = passwordHasher.HashPassword("Admin@12345"),
            Role = "Admin",
            IsBlocked = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(admin);

        await context.SaveChangesAsync();
    }
}