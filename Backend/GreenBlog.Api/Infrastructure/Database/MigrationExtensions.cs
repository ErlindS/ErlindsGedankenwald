using Microsoft.EntityFrameworkCore;
namespace GreenBlog.Api.Data;

public static class MigrationExtensions
{
    public static void ApplyMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
        db.Database.Migrate();
    }
}