using ecom.Interfaces;
using ecom.Models;
using ecom.Repository;
using ecom.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<ShopRepository>();
builder.Services.AddSingleton<KeyTokenRepository>();

// builder.Services.AddAuthentication(options => {
//     options.DefaultAuthenticateScheme = 
//     options.DefaultChallengeScheme =
//     options.DefaultForbidScheme = 
//     options.DefaultScheme = 
//     options.DefaultSignOutScheme =
//     options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
// }).AddJwtBearer(options => {
//     options.TokenValidationParameters = new TokenValidationParameters {
//         ValidateIssuer = true,
//         ValidIssuer = builder.Configuration["JWT:Issuer"],
//         ValidateAudience = true,
//         ValidAudience = builder.Configuration["JWT:Audience"],
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = new SymmetricSecurityKey(
//             System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
//         )
//     };
// });


builder.Services.AddResponseCompression(options => 
{
    options.EnableForHttps = true;
});

builder.Services.AddScoped<IShopRepository, ShopRepository>();
builder.Services.AddScoped<IKeyTokenRepository, KeyTokenRepository>();

builder.Services.AddControllers().AddNewtonsoftJson(options => {
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .SetIsOriginAllowed(origin => true));

app.UseResponseCompression();
// db.serverStatus().connections;

// app.MapGet("/", () =>
// {
//     var strCompess = string.Concat(Enumerable.Repeat("hello world", 100000));
//     return new {message = "hello world", metadata = strCompess};
// });

app.MapControllers();

app.Run();
