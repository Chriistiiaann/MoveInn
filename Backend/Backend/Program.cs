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

        builder.Services.AddControllers();
        builder.Services.AddControllers().AddJsonOptions(options => {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });

        builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
        StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];
        builder.Services.AddScoped<PaymentService>();


        //Contextos
        builder.Services.AddScoped<DataContext>();
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

        // Servicios
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

        // WebSocket
        builder.Services.AddSingleton<WebsocketHandler>();
        builder.Services.AddSingleton<IFollowRepository, FollowRepository>();
        builder.Services.AddSingleton<IFollowService, FollowService>();
        builder.Services.AddSingleton<INotificationService, NotificationService>();
        builder.Services.AddSingleton<IMessagesService, MessagesService>();
        builder.Services.AddSingleton<middleware>();

        //Swagger
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
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

        builder.Services.AddAuthentication()
        .AddJwtBearer(options =>
        {
            Settings settings = builder.Configuration.GetSection(Settings.SECTION_NAME).Get<Settings>()!;
            string key = Environment.GetEnvironmentVariable("JWT_KEY");

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
            };
        });

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
            });
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        app.UseAuthentication();
        app.UseWebSockets();

        app.UseHttpsRedirection();
        app.UseAuthorization();

        app.UseMiddleware<middleware>();
        app.UseCors();

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
        using IServiceScope scope = serviceProvider.CreateScope();
        using DataContext dbContext = scope.ServiceProvider.GetService<DataContext>()!;

        if (dbContext.Database.EnsureCreated())
        {
            Seeder seeder = new Seeder(dbContext);
            await seeder.SeedAsync();
        }

    }
}