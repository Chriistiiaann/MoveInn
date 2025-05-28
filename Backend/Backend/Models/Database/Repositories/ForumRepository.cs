using Backend.Models.Database.Entities;
using Backend.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories;

public class ForumRepository : IForumRepository
{
    private readonly DataContext _context;
    public ForumRepository(DataContext context)
    {
        _context = context;
    }

    public async Task CreateReviewAsync(Forum forum)
    {
        await _context.Forum.AddAsync(forum);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Forum>> GetAllForumsAsync()
    {
        return await _context.Forum
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetAllCountriesAsync()
    {
        return await _context.Forum
            .Where(a => !string.IsNullOrEmpty(a.Country))
            .Select(a => a.Country)
            .Distinct()
            .ToListAsync();
    }

    public async Task<Forum> GetForumByIdAsync(Guid id)
    {
        return await _context.Forum
                .FirstAsync(x => x.Id == id);
    }

    public async Task CreateThreadAsync(ForumThread forumThread)
    {
        await _context.ForumsThread.AddAsync(forumThread);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ForumThread>> GetThreadsByForumIdAsync(Guid forumId)
    {
        return await _context.ForumsThread
                             .Where(t => t.ForumId == forumId)
                             .ToListAsync();
    }

    public async Task<ForumThread?> GetThreadByIdAsync(Guid threadId)
    {
        return await _context.ForumsThread
                             .FirstOrDefaultAsync(t => t.Id == threadId);
    }

    public async Task CreateMessageAsync(ForumMessages message)
    {
        await _context.ForumsMessages.AddAsync(message);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ForumMessages>> GetMessagesByThreadIdAsync(Guid threadId)
    {
        return await _context.ForumsMessages
                             .Where(m => m.ThreadId == threadId)
                             .ToListAsync();
    }

    public async Task<ForumMessages?> GetMessageByIdAsync(Guid messageId)
    {
        return await _context.ForumsMessages
                             .FirstOrDefaultAsync(m => m.Id == messageId);
    }
    public async Task<IEnumerable<Forum>> GetForumsByUserIdAsync(Guid userId)
    {
        return await _context.Forum
                             .Where(f => f.CreatedBy == userId)
                             .ToListAsync();
    }


    public async Task<bool> DeleteForumAsync(Guid forumId, Guid userId)
    {
        var forum = await _context.Forum
            .FirstOrDefaultAsync(f => f.Id == forumId);

        if (forum == null)
            throw new KeyNotFoundException("The Forum doesn't exists");

        if (forum.CreatedBy != userId)
            return false;

        _context.Forum.Remove(forum);
        var changes = await _context.SaveChangesAsync();
        return changes > 0;
    }

}
