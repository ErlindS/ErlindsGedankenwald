using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using GreenBlog.Api.Data;
using GreenBlog.Api.Models;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.Run();

