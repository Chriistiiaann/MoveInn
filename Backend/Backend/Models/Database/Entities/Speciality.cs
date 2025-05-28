using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Database.Entities;

public class Speciality
{
    [Key]
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public ICollection<Hosts> Hosts { get; set; } = new List<Hosts>();
}
