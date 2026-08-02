using Microsoft.EntityFrameworkCore;

namespace GreenBlog.Api.Data;

public static class Endpoints
{
    public static void MapEndpoints(this WebApplication app)
    {
        app.MapGet("/posts", async (BlogDbContext db) =>
        {
            var posts = await db.Posts.ToListAsync();
            return Results.Ok(posts);
        });

        app.MapGet("/posts/{id}", async (int id, BlogDbContext db) =>
        {
            var post = await db.Posts.FindAsync(id);
            return post is not null ? Results.Ok(post) : Results.NotFound();
        });

        app.MapPost("/posts", async (Post post, BlogDbContext db) =>
        {
            db.Posts.Add(post);
            await db.SaveChangesAsync();
            return Results.Created($"/posts/{post.Id}", post);
        });

        app.MapPut("/posts/{id}", async (int id, Post updatedPost, BlogDbContext db) =>
        {
            var post = await db.Posts.FindAsync(id);
            if (post is null)
            {
                return Results.NotFound();
            }

            post.Title = updatedPost.Title;
            post.Content = updatedPost.Content;
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.MapDelete("/posts/{id}", async (int id, BlogDbContext db) =>
        {
            var post = await db.Posts.FindAsync(id);
            if (post is null)
            {
                return Results.NotFound();
            }

            db.Posts.Remove(post);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}