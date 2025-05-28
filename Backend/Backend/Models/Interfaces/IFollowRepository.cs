namespace Backend.Models.Interfaces;

public interface IFollowRepository
{
    Task<bool> AddFollowAsync(Guid followerId, Guid followingId);
    Task<int> GetFollowersCountAsync(Guid userId);
    Task<int> GetFollowingsCountAsync(Guid userId);
    Task<bool> RemoveFollowAsync(Guid followerId, Guid followingId);
}

