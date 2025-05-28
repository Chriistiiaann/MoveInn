using Backend.Models.Database.Entities;
using Backend.Models.Dtos;

namespace Backend.Models.Interfaces;

public interface IForumService
{
    Task<bool> CreateForumAsync(CreateForumDTO forum);
    Task<bool> CreateThreadAsync(CreateForumThreadDTO threadDto);
    Task<IEnumerable<ForumThreadDTO>> GetThreadsByForumIdAsync(Guid forumId);
    Task<bool> CreateMessageAsync(CreateForumMessageDTO messageDto);
    Task<IEnumerable<ForumMessageDTO>> GetMessagesByThreadIdAsync(Guid threadId);
    Task<IEnumerable<ForumDTO>> GetAllForumsAsync();
    Task <ForumDTO> GetForumByIdAsync(Guid id);
    Task<IEnumerable<string>> GetAllCountriesAsync();
    Task<bool> DeleteForumAsync(Guid forumId, Guid userId);
    Task<IEnumerable<Forum>> GetForumsByUserAsync(Guid userId);

}
