using Backend.Models.Database.Entities;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System.Collections.Generic;
using System.Net;

public class DataContext : DbContext
{
    private const string DATABASE_PATH = "MoveInnDB.db";

    public DbSet<User> Users { get; set; }
    public DbSet<Accommodation> Accommodations { get; set; }
    public DbSet<Recommendation> Recommendations { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<ImageAccommodation> ImageAccommodations { get; set; }
    public DbSet<SocialMediaLink> SocialMediaLinks { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Follow> Follows { get; set; }
    public DbSet<Forum> Forum { get; set; }
    public DbSet<ForumThread> ForumsThread { get; set; }
    public DbSet<ForumMessages> ForumsMessages { get; set; }
    public DbSet<Messages> Messages { get; set; }
    public DbSet<Hosts> Hosts { get; set; }
    public DbSet<Speciality> Speciality { get; set; }
    public DbSet<UserLanguage> UserLanguages { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.LogTo(Console.WriteLine);
        optionsBuilder.EnableSensitiveDataLogging();

        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        string connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

#if DEBUG
        optionsBuilder.UseSqlite($"DataSource={baseDir}{DATABASE_PATH}");
#else
        optionsBuilder.UseMySql(connectionString,ServerVersion.AutoDetect(connectionString));
#endif
    }
}