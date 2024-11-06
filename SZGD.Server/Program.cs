using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Data;
using IronOcr;

IronOcr.Installation.LicenseKey =
    "IRONSUITE.HU.MAKOWSKI.GMAIL.COM.23473-510061A268-CLDBP4Y-HMB5LJV7OEJA-ISOVQAKS4TCD-XVAG4XGXQRYX-FH6APF6TPRPE-Q2DYVEEQSHBU-H5DUT3CQKXWF-HTE2XU-TJEKZVD5HE6OEA-DEPLOYMENT.TRIAL-WMJPQQ.TRIAL.EXPIRES.06.DEC.2024";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllersWithViews();

// Register ApplicationDbContext with the connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//login
builder.Services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("AppDb"));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>(opt =>
{
    opt.Password.RequiredLength = 8;
    opt.User.RequireUniqueEmail = true;
    opt.Password.RequireNonAlphanumeric = false;
    opt.SignIn.RequireConfirmedEmail = false;
})
        .AddEntityFrameworkStores<AppDbContext>();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/login";
    options.AccessDeniedPath = "/access-denied";
});

//koniec login

//CORS
string FRONTEND_URL = "https://localhost:5137";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()    // Pozwól na wszystkie metody (GET, POST, itd.)
            .AllowAnyHeader();   // Pozwól na wszystkie nagłówki
    });
});
var app = builder.Build();
app.UseCors("AllowSpecificOrigins");
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapIdentityApi<IdentityUser>();
// Configure the HTTP request pipeline.
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
public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) :
        base(options)
    { }
}