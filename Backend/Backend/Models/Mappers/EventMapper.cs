using Backend.Models.Database.Entities;
using Backend.Models.Dtos;

namespace Backend.Services
{
    public static class EventMapper
    {
        public static EventDto ToDto(Event e, bool joined) => new()
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
            Joined = joined
        };

        public static Event FromCreateDto(EventCreateDto dto) => new()
        {
            CreatorId = dto.CreatorId,
            Title = dto.Title,
            Date = dto.Date,
            Location = dto.Location,
            Address = dto.Address,
            City = dto.City,
            Country = dto.Country,
            MaxAttendees = dto.MaxAttendees,
            Category = dto.Category,
            Description = dto.Description,
            Tags = dto.Tags.ToList()
        };

        public static void UpdateEntity(Event e, EventUpdateDto dto)
        {
            e.Title = dto.Title;
            e.Date = dto.Date;
            e.Location = dto.Location;
            e.Address = dto.Address;
            e.City = dto.City;
            e.Country = dto.Country;
            e.MaxAttendees = dto.MaxAttendees;
            e.Category = dto.Category;
            e.Description = dto.Description;

            e.Tags.Clear();
            foreach (var t in dto.Tags)
                e.Tags.Add(t);
        }
    }
}
