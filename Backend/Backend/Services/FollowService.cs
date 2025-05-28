using System.Text.Json;
using Backend.Models.Interfaces;
using Backend.WebSockets;

namespace Backend.Services;

public class FollowService : IFollowService
{
    private readonly IFollowRepository _followRepository;
    private readonly INotificationService _notificationService;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly WebsocketHandler _websocketHandler;

    public FollowService(IFollowRepository followRepository, INotificationService notificationService, IServiceScopeFactory serviceScopeFactory, WebsocketHandler websocketHandler)
    {
        _followRepository = followRepository;
        _notificationService = notificationService;
        _serviceScopeFactory = serviceScopeFactory;
        _websocketHandler = websocketHandler;
    }

    public async Task<bool> FollowUserAsync(Guid followerId, Guid followingId)
    {
        try
        {
            bool isFollowed = await _followRepository.AddFollowAsync(followerId, followingId);

            if (!isFollowed)
            {
                await _notificationService.SendNotificationAsync(
                    followerId.ToString(),
                    "Error al realizar follow.",
                    "notification");
                return false;
            }

            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<UserService>();
                var dto = await userService.GetUserByIdAsync(followerId);
                string name = dto?.Name ?? "Alguien";
                await _notificationService.SendNotificationAsync(
                    followingId.ToString(),
                    $"{name} te ha seguido.",
                    "notification");
            }

            await _notificationService.SendNotificationAsync(
                followerId.ToString(),
                "Follow realizado correctamente.",
                "notification");

            var (followersCount, followingsCount) = await GetFollowCountsAsync(followingId);

            var payload = new
            {
                action = "receive_counts",
                targetId = followingId,
                followers = followersCount,
                followings = followingsCount
            };
            string message = JsonSerializer.Serialize(payload);
            await _websocketHandler.SendMessageToUser(followingId.ToString(), message);

            return true;
        }
        catch (Exception ex)
        {
            string errorMsg = ex.Message.Contains("Ya sigues")
                ? "Ya estás siguiendo a este usuario."
                : "Ocurrió un error al seguir. Intenta de nuevo.";
            await _notificationService.SendNotificationAsync(
                followerId.ToString(),
                errorMsg,
                "notification");
            return false;
        }
    }
    public async Task<bool> UnfollowUserAsync(Guid followerId, Guid followingId)
    {
        try
        {
            bool isUnfollowed = await _followRepository.RemoveFollowAsync(followerId, followingId);

            if (!isUnfollowed)
            {
                await _notificationService.SendNotificationAsync(
                    followerId.ToString(),
                    "Error al realizar unfollow.",
                    "notification");
                return false;
            }

            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<UserService>();
                var dto = await userService.GetUserByIdAsync(followerId);
                string name = dto?.Name ?? "Alguien";
                await _notificationService.SendNotificationAsync(
                    followingId.ToString(),
                    $"{name} ha dejado de seguirte.",
                    "notification");
            }

            await _notificationService.SendNotificationAsync(
                followerId.ToString(),
                "Has dejado de seguir correctamente.",
                "notification");

            var (followersCount, followingsCount) = await GetFollowCountsAsync(followingId);
            var payload = new
            {
                action = "receive_counts",
                targetId = followingId,
                followers = followersCount,
                followings = followingsCount
            };
            string message = JsonSerializer.Serialize(payload);
            await _websocketHandler.SendMessageToUser(followingId.ToString(), message);

            return true;
        }
        catch (Exception ex)
        {
            string errorMsg = ex.Message.Contains("No sigues")
                ? "No sigues a este usuario."
                : "Ocurrió un error al dejar de seguir. Intenta de nuevo.";

            await _notificationService.SendNotificationAsync(
                followerId.ToString(),
                errorMsg,
                "notification");
            return false;
        }
    }


    public async Task<(int followers, int followings)> GetFollowCountsAsync(Guid userId)
    {
        int followers = await _followRepository.GetFollowersCountAsync(userId);
        int followings = await _followRepository.GetFollowingsCountAsync(userId);
        return (followers, followings);
    }
}
