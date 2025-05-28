using Backend.Models.Database.Enum;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Database.Entities;

public class UserLanguage
{
    [Key]
    public Guid Id { get; set; }

    public string Language { get; set; } = null!;

    public LanguageLevel Level { get; set; }

    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
}
