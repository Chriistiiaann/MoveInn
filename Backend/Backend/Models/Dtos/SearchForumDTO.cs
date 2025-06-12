using Backend.Models.Database.Enum;

namespace Backend.Models.Dtos;
public class SearchForumDTO
{
    public int Page { get; set; }
    public int Limit { get; set; }
    public string? Query { get; set; }
    public string? Country { get; set; }
    public ForumCategory? Category { get; set; }
    public string? SortField { get; set; }
    public string? SortOrder { get; set; }
}
