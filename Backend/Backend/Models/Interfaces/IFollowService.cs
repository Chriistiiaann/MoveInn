namespace Backend.Models.Interfaces;

public interface IFollowService
{
    Task<bool> FollowUserAsync(Guid followerId, Guid followingId);
    Task<(int followers, int followings)> GetFollowCountsAsync(Guid userId);
    Task<bool> UnfollowUserAsync(Guid followerId, Guid followingId);
}
