using Microsoft.EntityFrameworkCore;
using GreenBlog.Api.Models;


public class BlogDbContext : DbContext
{
    public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options)
    {
    }

    public DbSet<Post> Posts { get; set; }

}