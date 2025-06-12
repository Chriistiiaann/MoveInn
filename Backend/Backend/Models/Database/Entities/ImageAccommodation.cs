using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Database.Entities;

public class ImageAccommodation
{
    [Key]
    public Guid Id { get; set; }
    public required string Url { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(Accommodation))]
    public Guid AccommodationId { get; set; }
    public Accommodation Accommodation { get; set; }
}
