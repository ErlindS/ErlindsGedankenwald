using Microsoft.EntityFrameworkCore;
using GreenBlog.Api.Models;

namespace GreenBlog.Api.Data;

public class BlogDbContext : DbContext
{
    public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options) { }

    public DbSet<Article> Articles => Set<Article>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.HasIndex(a => a.Slug).IsUnique();
            entity.Property(a => a.Title).IsRequired();
            entity.Property(a => a.Slug).IsRequired();
            entity.Property(a => a.Summary).IsRequired();
            entity.Property(a => a.Content).IsRequired();
        });
    }
}
