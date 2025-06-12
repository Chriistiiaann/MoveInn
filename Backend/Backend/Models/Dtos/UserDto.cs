using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dtos;

public class UserDto
{
    [Key]
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? LastName { get; set; }

    [EmailAddress]
    public string? Mail { get; set; }

    public Role Role { get; set; } = Role.User;

    public string? Biography { get; set; }
    public string? AvatarUrl { get; set; }

    public string? School { get; set; }
    public string? City { get; set; }
    public string? Degree { get; set; }
    public string? Nationality { get; set; }
    public int ErasmusDate { get; set; }
    public string? ErasmusCountry { get; set; }

    [Phone]
    public string? Phone { get; set; }

    public List<SocialMediaLinkDto> SocialMedias { get; set; } = new();
    public List<UserLanguageDTO> Languages { get; set; } = new List<UserLanguageDTO>();
    public List<UserRelationDto> Followers { get; set; } = new List<UserRelationDto>();
    public List<UserRelationDto> Followings { get; set; } = new List<UserRelationDto>();
}

public class UserRelationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string AvatarUrl { get; set; } = null!;
    public string ErasmusCountry { get; set; } = null;
    public string City { get; set; } = null;
}

public class UserSearchDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Biography { get; set; }
    public string? AvatarUrl { get; set; }
    public string? School { get; set; }
    public string? City { get; set; }
    public string? Nationality { get; set; }
    public string? ErasmusCountry { get; set; }
}
