using GreenBlog.Api.Data;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
builder.Services.AddServiceDiscovery();

var dbDirectory = Path.Combine(builder.Environment.ContentRootPath, "Infrastructure", "Database");
Directory.CreateDirectory(dbDirectory);
var dbPath = Path.Combine(dbDirectory, "database.db");

builder.Services.AddDbContext<BlogDbContext>(options => options.UseSqlite($"Data Source={dbPath}"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder
    .Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing.AddHttpClientInstrumentation().AddConsoleExporter().AddOtlpExporter();
    })
    .WithMetrics(metrics =>
    {
        metrics.AddHttpClientInstrumentation().AddOtlpExporter();
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHealthChecks("/health");
app.MapHealthChecks("/alive");

app.ApplyMigrations();
app.MapEndpoints();

app.Run();
