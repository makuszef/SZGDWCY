using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Data;
using IronOcr;
using SZGD.Server.Models;

IronOcr.Installation.LicenseKey = 
    "IRONSUITE.HU.MAKOWSKI.GMAIL.COM.23473-510061A268-CLDBP4Y-HMB5LJV7OEJA-ISOVQAKS4TCD-XVAG4XGXQRYX-FH6APF6TPRPE-Q2DYVEEQSHBU-H5DUT3CQKXWF-HTE2XU-TJEKZVD5HE6OEA-DEPLOYMENT.TRIAL-WMJPQQ.TRIAL.EXPIRES.06.DEC.2024";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllersWithViews();

// Register ApplicationDbContext with the connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<Domownik>(opt =>
{
    opt.Password.RequiredLength = 8;
    opt.User.RequireUniqueEmail = true;
    opt.Password.RequireNonAlphanumeric = false;
    opt.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/login";
    options.AccessDeniedPath = "/access-denied";
});

// CORS
string FRONTEND_URL = "https://localhost:5137";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors("AllowSpecificOrigins");
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapIdentityApi<Domownik>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");
app.MapGet("/testLogin", (ClaimsPrincipal user) => $"Hello user {user.Identity!.Name}").RequireAuthorization();

app.Run();
