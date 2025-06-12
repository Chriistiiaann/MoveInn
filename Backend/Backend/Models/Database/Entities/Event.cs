using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Database.Enum;

namespace Backend.Models.Database.Entities
{
    public class Event
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime Date { get; set; }
        public string Location { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public int AttendeesCount { get; set; } = 0;
        public int? MaxAttendees { get; set; }

        public EventCategory Category { get; set; }
        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public ICollection<string> Tags { get; set; } = new List<string>();

        [ForeignKey(nameof(Creator))]
        public Guid CreatorId { get; set; }
        public User Creator { get; set; }

        public ICollection<User> Participants { get; set; } = new List<User>();
    }
}
