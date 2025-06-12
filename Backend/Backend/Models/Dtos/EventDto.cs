using Backend.Models.Database.Enum;

namespace Backend.Models.Dtos
{
    public class EventDto
    {
        public Guid Id { get; set; }
        public Guid CreatorId { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public int AttendeesCount { get; set; }
        public int? MaxAttendees { get; set; }
        public EventCategory Category { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Tags { get; set; }

        public Guid CreatorId { get; set; }
        public string CreatorName { get; set; }
        public string CreatorLastName { get; set; }
        public string CreatorAvatarUrl { get; set; }

        public bool Joined { get; set; }
    }
}
