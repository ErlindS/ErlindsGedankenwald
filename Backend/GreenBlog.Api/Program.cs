using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using GreenBlog.Api.Data;
using GreenBlog.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy for Angular Dev Server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register SQLite database
var dataDir = Path.Combine(Directory.GetCurrentDirectory(), "data");
if (!Directory.Exists(dataDir))
{
    Directory.CreateDirectory(dataDir);
}

var dbPath = Path.Combine(dataDir, "blog.db");
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

var app = builder.Build();

app.UseCors("AllowAll");

// Ensure database and tables are created on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
    db.Database.EnsureCreated();

    // Seed test data if empty (remove this block once you use DBeaver)
    if (!db.Articles.Any())
    {
        db.Articles.AddRange(
            new Article
            {
                Title = "Mein erster Gedanke",
                Slug = "mein-erster-gedanke",
                Summary = "Ein kurzer Einblick in die Welt des Gedankenwaldes und warum ich diesen Ort erschaffen habe.",
                Content = "## Willkommen im Gedankenwald\n\nDies ist mein **erster Artikel** in Erlinds Gedankenwald.\n\n### Was erwartet dich?\n\n- Gedanken über Software-Entwicklung\n- Nachhaltigkeit im Alltag\n- Minimalistisches Leben\n\n> Der Wald ist still, aber voller Ideen.\n\nIch freue mich, dass du hier bist!",
                Tags = "Gedanken,Persönlich",
                CreatedAt = new DateTime(2026, 4, 12, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 4, 12, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true
            },
            new Article
            {
                Title = "Angular und .NET — Mein Tech-Stack",
                Slug = "angular-und-dotnet",
                Summary = "Warum ich mich für Angular und .NET als Technologie-Stack entschieden habe.",
                Content = "## Mein Tech-Stack\n\nFür den Gedankenwald nutze ich **Angular** im Frontend und **.NET** im Backend.\n\n### Warum Angular?\n\n1. Starke Typisierung mit TypeScript\n2. Komponentenbasierte Architektur\n3. Exzellentes CLI-Tooling\n\n### Warum .NET?\n\nDie Kombination gibt mir die perfekte Balance zwischen **Produktivität** und **Performance**.",
                Tags = "Software,Programmieren",
                CreatedAt = new DateTime(2026, 4, 11, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 4, 11, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true
            },
            new Article
            {
                Title = "Minimalistisch kochen",
                Slug = "minimalistisch-kochen",
                Summary = "Wie man mit wenigen Zutaten großartige Gerichte zaubern kann.",
                Content = "## Weniger ist mehr\n\nAuch in der Küche kann man mit **wenigen, hochwertigen Zutaten** wunderbare Gerichte zaubern.\n\n### Meine 5 Grundregeln\n\n1. Maximal 5-7 Zutaten pro Gericht\n2. Saisonale Produkte bevorzugen\n3. Grundrezepte meistern\n4. Meal-Prep spart Zeit\n5. Reste kreativ verwerten\n\n> Gutes Essen muss nicht kompliziert sein.",
                Tags = "Kochen,Minimalismus",
                CreatedAt = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true
            }
        );
        db.SaveChanges();
    }
}

var historyFile = Path.Combine(dataDir, "history.json");

// Helper method to load history
async Task<Dictionary<string, List<RecipeHistory>>> LoadHistoryAsync()
{
    if (!File.Exists(historyFile))
    {
        return new Dictionary<string, List<RecipeHistory>>();
    }

    var json = await File.ReadAllTextAsync(historyFile);
    return JsonSerializer.Deserialize<Dictionary<string, List<RecipeHistory>>>(json) ?? new Dictionary<string, List<RecipeHistory>>();
}

// Helper method to save history
async Task SaveHistoryAsync(Dictionary<string, List<RecipeHistory>> history)
{
    var json = JsonSerializer.Serialize(history, new JsonSerializerOptions { WriteIndented = true });
    await File.WriteAllTextAsync(historyFile, json);
}

// GET history
app.MapGet("/api/history", async () =>
{
    var history = await LoadHistoryAsync();
    return Results.Ok(history);
});

// POST new history entry for a day
app.MapPost("/api/history/{dayId}", async (string dayId, RecipeHistory newEntry) =>
{
    var history = await LoadHistoryAsync();

    if (!history.ContainsKey(dayId))
    {
        history[dayId] = new List<RecipeHistory>();
    }

    newEntry.Id = Guid.NewGuid().ToString(); // Generate a unique ID if not provided
    history[dayId].Insert(0, newEntry); // Add to the top of the list

    await SaveHistoryAsync(history);

    return Results.Created($"/api/history/{dayId}", newEntry);
});

// ─── ARTICLE ENDPOINTS ─────────────────────────────────────────────────

// GET all published articles (list view — without full content)
app.MapGet("/api/articles", async (BlogDbContext db) =>
{
    var articles = await db.Articles
        .Where(a => a.IsPublished)
        .OrderByDescending(a => a.CreatedAt)
        .Select(a => new
        {
            a.Id,
            a.Title,
            a.Slug,
            a.Summary,
            a.Tags,
            a.CreatedAt,
            a.UpdatedAt
        })
        .ToListAsync();

    return Results.Ok(articles);
});

// GET single article by slug (full content)
app.MapGet("/api/articles/{slug}", async (string slug, BlogDbContext db) =>
{
    var article = await db.Articles
        .Where(a => a.IsPublished && a.Slug == slug)
        .FirstOrDefaultAsync();

    if (article is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(article);
});

app.Run();

// Models
public class RecipeHistory
{
    public string Id { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string SpecificName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string? RecipeLink { get; set; }
}
