using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

public class AdminRepository : IAdminRepository
{
    private readonly DataContext _context;

    public AdminRepository(DataContext context)
    {
        _context = context;
    }


    public async Task<bool> DeleteEntityAsync<TEntity>(Guid id) where TEntity : class
    {
        var set = _context.Set<TEntity>();
        var entity = await set.FindAsync(id);
        if (entity == null)
            return false;

        var entry = _context.Entry(entity);
        foreach (var nav in entry.Navigations)
        {
            if (!nav.Metadata.IsCollection)
                continue;

            await nav.LoadAsync();

            if (nav.CurrentValue is IEnumerable<object> children)
                _context.RemoveRange(children);
        }

        set.Remove(entity);
        return (await _context.SaveChangesAsync()) > 0;
    }


    public Task<bool> DeleteForumAsync(Guid forumId) => DeleteEntityAsync<Forum>(forumId);
    public Task<bool> DeleteEventAsync(Guid eventId) => DeleteEntityAsync<Event>(eventId);
    public Task<bool> DeleteRecommendationAsync(Guid commentId) => DeleteEntityAsync<Recommendation>(commentId);
    public Task<bool> DeleteAccommodationAsync(Guid accommodationId) => DeleteEntityAsync<Accommodation>(accommodationId);
    public Task<bool> DeleteReservationAsync(Guid reservationId) => DeleteEntityAsync<Reservation>(reservationId);
    public Task<bool> DeleteReviewAsync(Guid reviewId) => DeleteEntityAsync<Review>(reviewId);

    public async Task<bool> UpdateUserRoleAsync(Guid userId, Role newRole)
    {
        var user = await _context.Set<User>().FindAsync(userId);
        if (user == null)
            return false;

        user.Role = newRole;

        return (await _context.SaveChangesAsync()) > 0;
    }

}
