using Backend.Models.Database.Enum;

namespace Backend.Models.Dtos;

public class UserLanguageDTO
{
    public string Language { get; set; } = null!;
    public LanguageLevel Level { get; set; }
}
public class UserLanguageUpdateRequest
{
    public List<UserLanguageDTO> UserLanguages { get; set; } = new();
}