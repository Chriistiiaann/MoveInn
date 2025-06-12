using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Models.Dtos;
using Backend.Models.Mappers;
using F23.StringSimilarity;
using F23.StringSimilarity.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;

namespace Backend.Services;

public class SmartSearchService
{
    private const double THRESHOLD = 0.75;
    private readonly INormalizedStringSimilarity _stringSimilarityComparer;
    private readonly DataContext _context;
    private readonly UnitOfWork _unitOfWork;

    public SmartSearchService(DataContext context, UnitOfWork unitOfWork)
    {
        _context = context;
        _stringSimilarityComparer = new JaroWinkler();
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<AccommodationDTO>> SearchAccommodationAsync(string query)
    {
        List<Accommodation> result;

        if (string.IsNullOrWhiteSpace(query))
        {
            result = await _context.Accommodations.ToListAsync();
        }
        else
        {
            string[] queryKeys = GetKeys(ClearText(query));
            result = new List<Accommodation>();

            var accommodations = await _context.Accommodations.ToListAsync();

            foreach (var accommodation in accommodations)
            {
                string[] itemKeys = GetKeys(ClearText(accommodation.Title));

                if (IsMatch(queryKeys, itemKeys))
                {
                    result.Add(accommodation);
                }
            }
        }

        return result.Select(a => new AccommodationDTO
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            Address = a.Address,
            City = a.City,
            Country = a.Country,
            Category = a.AcommodationType,
            PricePerMonth = a.PricePerMonth,
            NumberOfRooms = a.NumberOfRooms,
            Bathrooms = a.Bathrooms,
            SquareMeters = a.SquareMeters,
            HasWifi = a.HasWifi,
            OwnerId = a.OwnerId,
            AvailableFrom = a.AvailableFrom,
            AvailableTo = a.AvailableTo
        });
    }

    public async Task<IEnumerable<RecommendationDto>> SearchReccomendationAsync(string query)
    {
        List<Recommendation> result;

        if (string.IsNullOrWhiteSpace(query))
        {
            result = await _context.Recommendations.ToListAsync();
        }
        else
        {
            string[] queryKeys = GetKeys(ClearText(query));
            result = new List<Recommendation>();

            var recommendations = await _context.Recommendations.ToListAsync();

            foreach (var recomendation in recommendations)
            {
                string[] itemKeys = GetKeys(ClearText(recomendation.Title));

                if (IsMatch(queryKeys, itemKeys))
                {
                    result.Add(recomendation);
                }
            }
        }

        return result.Select(r => new RecommendationDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            Category = r.Category,
            Address = r.Address,
            City = r.City,
            Country = r.Country,
            Rating = r.Rating,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<IEnumerable<ForumDTO>> SearchForumsAsync(string query)
    {
        List<Forum> rawForums;

        if (string.IsNullOrWhiteSpace(query))
        {
            rawForums = await _context.Forum.ToListAsync();
        }
        else
        {
            var keys = GetKeys(ClearText(query));
            rawForums = new List<Forum>();

            var allForums = await _context.Forum.ToListAsync();
            foreach (var forum in allForums)
            {
                var itemKeys = GetKeys(ClearText(forum.Title + " " + forum.Description));
                if (IsMatch(keys, itemKeys))
                    rawForums.Add(forum);
            }
        }

        var dtos = new List<ForumDTO>();

        foreach (var forum in rawForums)
        {
            var dto = ForumMapper.ToDto(forum);

            var user = await _unitOfWork.UserRepository.GetUserDataByIdAsync(forum.CreatedBy);
            if (user != null)
            {
                dto.CreatorName = user.Name;
                dto.CreatorAvatar = user.AvatarUrl;
                dto.CreatorNationatility = user.Nationality;
            }
            else
            {
                dto.CreatorName = "Usuario desconocido";
                dto.CreatorAvatar = "default-avatar.png";
                dto.CreatorNationatility = "Nacionalidad desconocida";
            }

            dtos.Add(dto);
        }

        return dtos;
    }

    public async Task<IEnumerable<EventDto>> SearchEventsAsync(
    string query,
    Guid? currentUserId = null)
    {
        var allEvents = await _context.Events
            .AsNoTracking()
            .Include(e => e.Creator)
            .Include(e => e.Participants)
            .ToListAsync();

        var filtered = new List<Event>();
        if (string.IsNullOrWhiteSpace(query))
        {
            filtered = allEvents;
        }
        else
        {
            var queryKeys = GetKeys(ClearText(query));
            foreach (var ev in allEvents)
            {
                var itemKeys = GetKeys(ClearText(ev.Title + " " + ev.Description));
                if (IsMatch(queryKeys, itemKeys))
                    filtered.Add(ev);
            }
        }

        return filtered.Select(e => new EventDto
        {
            Id = e.Id,
            Title = e.Title,
            Date = e.Date,
            Location = e.Location,
            Address = e.Address,
            City = e.City,
            Country = e.Country,
            AttendeesCount = e.AttendeesCount,
            MaxAttendees = e.MaxAttendees,
            Category = e.Category,
            Description = e.Description,
            ImageUrl = e.ImageUrl,
            Tags = e.Tags.ToList(),

            CreatorId = e.CreatorId,
            CreatorName = e.Creator?.Name ?? string.Empty,
            CreatorLastName = e.Creator?.LastName ?? string.Empty,
            CreatorAvatarUrl = e.Creator?.AvatarUrl ?? string.Empty,

            Joined = currentUserId.HasValue
                               && e.Participants.Any(u => u.Id == currentUserId.Value)
        });
    }


    public async Task<IEnumerable<UserSearchDto>> SearchUsersAsync(string query)
    {
        List<User> result;

        if (string.IsNullOrWhiteSpace(query))
        {
            result = await _context.Users.ToListAsync();
        }
        else
        {
            var queryKeys = GetKeys(ClearText(query));
            result = new List<User>();
            var users = await _context.Users.ToListAsync();

            foreach (var u in users)
            {
                var itemKeys = GetKeys(ClearText(u.Name + " " + u.School));
                if (IsMatch(queryKeys, itemKeys))
                    result.Add(u);
            }
        }

        return result.Select(u => new UserSearchDto
        {
            Id = u.Id,
            Name = u.Name,
            Biography = u.Biography,
            AvatarUrl = u.AvatarUrl,
            School = u.School,
            City = u.City,
            Nationality = u.Nationality,
            ErasmusCountry = u.ErasmusCountry
        });
    }

    public async Task<IEnumerable<HostSearchDTO>> SearchHostsAsync(string query)
    {
        List<Hosts> result;

        if (string.IsNullOrWhiteSpace(query))
        {
            result = await _context.Hosts
                .Include(h => h.User)
                .Include(h => h.Specialties)
                .ToListAsync();
        }
        else
        {
            var queryKeys = GetKeys(ClearText(query));
            result = new List<Hosts>();
            var allHosts = await _context.Hosts
                .Include(h => h.User)
                .Include(h => h.Specialties)
                .ToListAsync();

            foreach (var h in allHosts)
            {
                var itemKeys = GetKeys(ClearText(h.User.Name + " " + h.User.School));
                if (IsMatch(queryKeys, itemKeys))
                    result.Add(h);
            }
        }

        return result.Select(h => new HostSearchDTO
        {
            Id = h.User.Id,
            Name = h.User.Name,
            Biography = h.User.Biography,
            AvatarUrl = h.User.AvatarUrl,
            School = h.User.School,
            City = h.User.City,
            Nationality = h.User.Nationality,
            ErasmusCountry = h.User.ErasmusCountry,
            Specialties = h.Specialties
                .Select(s => new SpecialityDTO
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .ToList()
        });
    }

    private bool IsMatch(string[] queryKeys, string[] itemKeys)
    {
        bool isMatch = false;

        for (int i = 0; !isMatch && i < itemKeys.Length; i++)
        {
            string itemKey = itemKeys[i];

            for (int j = 0; !isMatch && j < queryKeys.Length; j++)
            {
                string queryKey = queryKeys[j];

                isMatch = IsMatch(itemKey, queryKey);
            }
        }

        return isMatch;
    }

    private bool IsMatch(string itemKey, string queryKey)
    {
        return itemKey == queryKey
            || itemKey.Contains(queryKey)
            || _stringSimilarityComparer.Similarity(itemKey, queryKey) >= THRESHOLD;
    }

    private string[] GetKeys(string query)
    {
        return query.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    private string ClearText(string text)
    {
        return RemoveDiacritics(text.ToLower());
    }

    private string RemoveDiacritics(string text)
    {
        string normalizedString = text.Normalize(NormalizationForm.FormD);
        StringBuilder stringBuilder = new StringBuilder(normalizedString.Length);

        for (int i = 0; i < normalizedString.Length; i++)
        {
            char c = normalizedString[i];
            UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }
}
