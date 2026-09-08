using HireFlow.Models;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Tables
    public DbSet<User> Users { get; set; }

    public DbSet<JobSeekerProfile> JobSeekerProfiles { get; set; }

    public DbSet<RecruiterProfile> RecruiterProfiles { get; set; }

    public DbSet<Company> Companies { get; set; }

    public DbSet<Job> Jobs { get; set; }

    public DbSet<JobApplication> JobApplications { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        // =========================
        // User
        // =========================

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();


        // =========================
        // User -> JobSeekerProfile
        // One User has One JobSeekerProfile
        // =========================

        modelBuilder.Entity<JobSeekerProfile>()
            .HasOne(p => p.User)
            .WithOne(u => u.JobSeekerProfile)
            .HasForeignKey<JobSeekerProfile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobSeekerProfile>()
            .HasIndex(p => p.UserId)
            .IsUnique();


        // =========================
        // User -> RecruiterProfile
        // One User has One RecruiterProfile
        // =========================

        modelBuilder.Entity<RecruiterProfile>()
            .HasOne(p => p.User)
            .WithOne(u => u.RecruiterProfile)
            .HasForeignKey<RecruiterProfile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RecruiterProfile>()
            .HasIndex(p => p.UserId)
            .IsUnique();


        // =========================
        // Company -> RecruiterProfile
        // One Company has Many Recruiters
        // =========================

        modelBuilder.Entity<RecruiterProfile>()
            .HasOne(r => r.Company)
            .WithMany(c => c.Recruiters)
            .HasForeignKey(r => r.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);


        // =========================
        // Company -> Job
        // One Company has Many Jobs
        // =========================

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Company)
            .WithMany(c => c.Jobs)
            .HasForeignKey(j => j.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);


        // =========================
        // RecruiterProfile -> Job
        // One Recruiter has Many Jobs
        // =========================

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Recruiter)
            .WithMany(r => r.Jobs)
            .HasForeignKey(j => j.RecruiterId)
            .OnDelete(DeleteBehavior.Restrict);


        // =========================
        // Job -> JobApplication
        // One Job has Many Applications
        // =========================

        modelBuilder.Entity<JobApplication>()
            .HasOne(a => a.Job)
            .WithMany(j => j.Applications)
            .HasForeignKey(a => a.JobId)
            .OnDelete(DeleteBehavior.Restrict);


        // =========================
        // JobSeekerProfile -> JobApplication
        // One JobSeeker has Many Applications
        // =========================

        modelBuilder.Entity<JobApplication>()
            .HasOne(a => a.JobSeeker)
            .WithMany(s => s.Applications)
            .HasForeignKey(a => a.JobSeekerId)
            .OnDelete(DeleteBehavior.Restrict);


        // =========================
        // Prevent duplicate application
        // One JobSeeker cannot apply
        // to the same Job twice
        // =========================

        modelBuilder.Entity<JobApplication>()
            .HasIndex(a => new
            {
                a.JobId,
                a.JobSeekerId
            })
            .IsUnique();


        // =========================
        // Decimal precision
        // =========================

        modelBuilder.Entity<Job>()
            .Property(j => j.SalaryMin)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Job>()
            .Property(j => j.SalaryMax)
            .HasPrecision(18, 2);
    }
}