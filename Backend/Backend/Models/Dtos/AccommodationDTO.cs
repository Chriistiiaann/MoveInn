using System.ComponentModel.DataAnnotations;
using Backend.Models.Database.Enum;

namespace Backend.Models.Dtos;
public class AccommodationDTO
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public AcommodationType Category { get; set; }
    public decimal PricePerMonth { get; set; }
    public int NumberOfRooms { get; set; }
    public int Bathrooms { get; set; }
    public int SquareMeters { get; set; }
    public bool HasWifi { get; set; }
    public Guid OwnerId { get; set; }

    [DataType(DataType.Date)]
    public DateTime AvailableFrom { get; set; }

    [DataType(DataType.Date)]
    public DateTime AvailableTo { get; set; }
    public List<string> Images { get; set; } = new();

    public AcommodationType AcommodationType { get; set; }

}
