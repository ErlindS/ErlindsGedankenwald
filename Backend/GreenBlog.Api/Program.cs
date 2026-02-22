using System.Text.Json;

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

var app = builder.Build();

app.UseCors("AllowAll");

var dataDir = Path.Combine(Directory.GetCurrentDirectory(), "data");
if (!Directory.Exists(dataDir))
{
    Directory.CreateDirectory(dataDir);
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
