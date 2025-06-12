using System.ComponentModel.DataAnnotations;
using Backend.Models.Database.Enum;

namespace Backend.Models.Dtos
{
    public class EventCreateDto
    {
        [Required]
        public Guid CreatorId { get; set; }

        public required string Title { get; set; }

        public DateTime Date { get; set; }

        public string Location { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public int? MaxAttendees { get; set; }

        public EventCategory Category { get; set; }

        public string Description { get; set; }

        public IFormFile ImageFile { get; set; }

        public List<string> Tags { get; set; } = new List<string>();
    }
    public class EventUpdateDto : EventCreateDto { }

}
