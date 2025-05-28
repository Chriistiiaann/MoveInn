using Backend.Models.Database.Entities;

namespace Backend.Models.Interfaces;

public interface IForumRepository
{
    Task CreateReviewAsync(Forum forum);
    Task CreateThreadAsync(ForumThread forumThread);
    Task<Forum> GetForumByIdAsync(Guid id);
    Task<IEnumerable<ForumThread>> GetThreadsByForumIdAsync(Guid forumId);
    Task<ForumThread?> GetThreadByIdAsync(Guid threadId);
    Task CreateMessageAsync(ForumMessages message);
    Task<IEnumerable<ForumMessages>> GetMessagesByThreadIdAsync(Guid threadId);
    Task<ForumMessages?> GetMessageByIdAsync(Guid messageId);
    Task<IEnumerable<Forum>> GetAllForumsAsync();
    Task<IEnumerable<string>> GetAllCountriesAsync();
    Task<bool> DeleteForumAsync(Guid forumId, Guid userId);
    Task<IEnumerable<Forum>> GetForumsByUserIdAsync(Guid userId);

}
