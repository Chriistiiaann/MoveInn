using Backend.Models.Database.Entities; 
using Backend.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories
{
    public class FollowRepository : IFollowRepository
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public FollowRepository(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task<bool> AddFollowAsync(Guid followerId, Guid followingId)
        {
            if (followerId == Guid.Empty)
                throw new Exception("Falta el identificador del seguidor.");
            if (followingId == Guid.Empty)
                throw new Exception("Falta el identificador del usuario a seguir.");

            try
            {
                using IServiceScope scope = _serviceScopeFactory.CreateScope();
                using DataContext context = scope.ServiceProvider.GetRequiredService<DataContext>();

                bool exists = await context.Follows.AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);
                if (exists)
                    throw new Exception("Ya sigues a este usuario.");

                var follow = new Follow
                {
                    FollowerId = followerId,
                    FollowingId = followingId,
                    CreatedAt = DateTime.UtcNow
                };

                context.Follows.Add(follow);
                int changes = await context.SaveChangesAsync();
                return changes > 0;
            }
            catch (DbUpdateException)
            {
                throw new Exception("No se pudo completar el seguimiento. Inténtalo de nuevo más tarde.");
            }
            catch (Exception ex)
            {
                if (ex.Message == "Ya sigues a este usuario.")
                    throw;
                else
                    throw new Exception("Ocurrió un error al intentar seguir al usuario. Por favor, inténtalo más tarde.");
            }
        }

        public async Task<bool> RemoveFollowAsync(Guid followerId, Guid followingId)
        {
            if (followerId == Guid.Empty)
                throw new Exception("Falta el identificador del seguidor.");
            if (followingId == Guid.Empty)
                throw new Exception("Falta el identificador del usuario a dejar de seguir.");

            try
            {
                using var scope = _serviceScopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<DataContext>();

                var follow = await context.Follows
                    .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);

                if (follow == null)
                    throw new Exception("No sigues a este usuario.");

                context.Follows.Remove(follow);
                var changes = await context.SaveChangesAsync();
                return changes > 0;
            }
            catch (DbUpdateException)
            {
                throw new Exception("No se pudo completar el unfollow. Inténtalo de nuevo más tarde.");
            }
            catch (Exception ex)
            {
                if (ex.Message == "No sigues a este usuario.")
                    throw;
                throw new Exception("Ocurrió un error al intentar dejar de seguir. Por favor, inténtalo más tarde.");
            }
        }

        public async Task<int> GetFollowersCountAsync(Guid userId)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();
            return await context.Follows.CountAsync(f => f.FollowingId == userId);
        }

        public async Task<int> GetFollowingsCountAsync(Guid userId)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();
            return await context.Follows.CountAsync(f => f.FollowerId == userId);
        }
    }
}
