using System.Text;
using System.Text.Json.Serialization;
using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.Database.Repositories;
using Backend.Models.Interfaces;
using Backend.Services;
using Backend.WebSockets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Stripe;
using Swashbuckle.AspNetCore.Filters;

namespace Backend;
public class Program
{
    public static async Task Main(string[] args)
    {
        Directory.SetCurrentDirectory(AppContext.BaseDirectory);

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.Configure<Settings>(builder.Configuration.GetSection(Settings.SECTION_NAME));

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
            );

        builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
        StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];
        builder.Services.AddScoped<PaymentService>();

        builder.Services.AddDbContext<DataContext>();
        builder.Services.AddScoped<UserRepository>();
        builder.Services.AddScoped<RecommendationRepository>();
        builder.Services.AddScoped<UnitOfWork>();
        builder.Services.AddScoped<IAccommodationRepository, AccommodationRepository>();
        builder.Services.AddScoped<ReservationRepository>();
        builder.Services.AddScoped<EventRepository>();
        builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
        builder.Services.AddScoped<IChatRepository, ChatRepository>();
        builder.Services.AddScoped<IMessagesRepository, MessagesRepository>();
        builder.Services.AddScoped<IHostRepository, HostRepository>();
        builder.Services.AddScoped<IAdminRepository, AdminRepository>();

        builder.Services.AddScoped<AuthService>();
        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<IAccommodationService, AccommodationService>();
        builder.Services.AddScoped<RecommendationService>();
        builder.Services.AddScoped<ReservationService>();
        builder.Services.AddScoped<Services.EventService>();
        builder.Services.AddHttpClient("CountriesNow", client =>
        {
            client.BaseAddress = new Uri("https://countriesnow.space/api/v0.1/");
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        });
        builder.Services.AddScoped<CountriesNowService>();
        builder.Services.AddScoped<SmartSearchService>();
        builder.Services.AddScoped<IReviewService, Services.ReviewService>();
        builder.Services.AddScoped<IForumService, ForumService>();
        builder.Services.AddScoped<IChatService, ChatService>();
        builder.Services.AddScoped<IHostService, HostService>();
        builder.Services.AddScoped<IAdminService, AdminService>();

        builder.Services.AddSingleton<WebsocketHandler>();
        builder.Services.AddSingleton<IFollowRepository, FollowRepository>();
        builder.Services.AddSingleton<IFollowService, FollowService>();
        builder.Services.AddSingleton<INotificationService, NotificationService>();
        builder.Services.AddSingleton<IMessagesService, MessagesService>();
        builder.Services.AddSingleton<middleware>();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
            {
                BearerFormat = "JWT",
                Name = "Authorization",
                Description = "Token",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = JwtBearerDefaults.AuthenticationScheme
            });
            options.OperationFilter<SecurityRequirementsOperationFilter>(true, JwtBearerDefaults.AuthenticationScheme);
        });

        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                string key = Environment.GetEnvironmentVariable("JWT_KEY")!;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        var token = ctx.Request.Query["token"];
                        if (!string.IsNullOrEmpty(token))
                        {
                            ctx.Token = token;
                        }
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = ctx =>
                    {
                         Console.WriteLine("✓ JWT válido para userId=" +
                             ctx.Principal.FindFirst("id")?.Value);
                         return Task.CompletedTask;
                    }
                };
            });

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                  .WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
            });
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseWebSockets();

        app.Map("/api/WebSocket/ws", subApp =>
        {
            subApp.Use(async (ctx, next) =>
            {
                if (ctx.WebSockets.IsWebSocketRequest)
                {
                    var tokenRecibido = ctx.Request.Query["token"].ToString();
                    Console.WriteLine($"[WS-Middleware] WSRequest a {ctx.Request.Path} con token={tokenRecibido}");
                    var socket = await ctx.WebSockets.AcceptWebSocketAsync();
                    Console.WriteLine("[WS-Handler] WebSocket aceptado");
                    var handler = ctx.RequestServices.GetRequiredService<WebsocketHandler>();
                    await handler.HandleAsync(ctx, socket);
                }
                else
                {
                    await next();
                }
            });
        });

        app.UseMiddleware<middleware>();

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"))
        });
        app.MapControllers();

        await SeedDatabase(app.Services);
        app.Run();
    }

    static async Task SeedDatabase(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        using var dbContext = scope.ServiceProvider.GetService<DataContext>()!;
        if (dbContext.Database.EnsureCreated())
        {
            var seeder = new Seeder(dbContext);
            await seeder.SeedAsync();
        }
    }
}
