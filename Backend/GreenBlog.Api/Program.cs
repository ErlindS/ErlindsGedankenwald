using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using GreenBlog.Api.Data;
using GreenBlog.Api.Models;

var builder = WebApplication.CreateBuilder(args);

var dbDirectory = Path.Combine(builder.Environment.ContentRootPath, "Infrastructure", "Database");
Directory.CreateDirectory(dbDirectory);
var dbPath = Path.Combine(dbDirectory, "blog.db");

builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

var app = builder.Build();

app.ApplyMigrations();
app.MapEndpoints();

app.Run();

