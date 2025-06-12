namespace Backend.Models.Dtos;

public class SearchUserDTO
{
    public string? Query { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
}
