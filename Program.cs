using MegaDevApi.Data;
using MegaDevApi.Dtos;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers (om du har controllers)
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS: frontend på megadev.se får anropa API:t på api.megadev.se
builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(p =>
        p.WithOrigins("https://megadev.se")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// SQLite (persistens)
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=data/notes.db"));

var app = builder.Build();

// Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

// CORS måste ligga före endpoints
app.UseCors();

// Landing page
app.MapGet("/", () =>
{
    var html = """
    <!doctype html>
    <html lang="sv">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>MegaDev API</title>
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:40px;max-width:920px}
        .card{border:1px solid #ddd;border-radius:14px;padding:22px}
        code{background:#f5f5f5;padding:2px 8px;border-radius:8px}
        a{text-decoration:none}
        .row{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px}
        .pill{border:1px solid #ddd;border-radius:999px;padding:10px 14px;display:inline-block}
      </style>
    </head>
    <body>
      <h1>MegaDev API</h1>
      <div class="card">
        <p>✅ Online</p>
        <div class="row">
          <a class="pill" href="/swagger"><code>/swagger</code></a>
          <a class="pill" href="/api/health"><code>/api/health</code></a>
          <a class="pill" href="/api/notes"><code>/api/notes</code></a>
        </div>
        <p style="margin-top:16px;color:#666">.NET 10 · nginx · Let’s Encrypt</p>
      </div>
    </body>
    </html>
    """;
    return Results.Content(html, "text/html; charset=utf-8");
});

// Health
app.MapGet("/api/health", () =>
    Results.Ok(new { status = "ok", framework = ".NET 10 LTS", time = DateTime.UtcNow })
);

// Notes endpoints (EF Core / SQLite)
app.MapGet("/api/notes", async (AppDbContext db) =>
{
    var notes = await db.Notes
        .OrderByDescending(n => n.Id)
        .Select(n => new { n.Id, n.Text, n.CreatedUtc })
        .ToListAsync();

    return Results.Ok(notes);
});

app.MapPost("/api/notes", async (AppDbContext db, NoteCreateDto dto) =>
{
    var text = (dto.Text ?? "").Trim();
    if (text.Length == 0) return Results.BadRequest(new { error = "Text is required." });
    if (text.Length > 120) return Results.BadRequest(new { error = "Max 120 chars." });

    var note = new Note { Text = text, CreatedUtc = DateTime.UtcNow };
    db.Notes.Add(note);
    await db.SaveChangesAsync();

    return Results.Created($"/api/notes/{note.Id}", new { note.Id });
});

app.MapDelete("/api/notes/{id:int}", async (AppDbContext db, int id) =>
{
    var note = await db.Notes.FindAsync(id);
    if (note is null) return Results.NotFound();

    db.Notes.Remove(note);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Controllers sist (om du använder dem)
app.MapControllers();

app.Run();

