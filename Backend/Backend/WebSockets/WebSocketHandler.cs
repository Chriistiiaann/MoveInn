using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Backend.Models.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Http;

namespace Backend.WebSockets
{
    public class WebsocketHandler
    {
        private static readonly ConcurrentDictionary<string, WebSocket> _connections = new();

        private static readonly ConcurrentDictionary<Guid, ConcurrentBag<string>> _countSubscribers = new ConcurrentDictionary<Guid, ConcurrentBag<string>>();

        public async Task HandleAsync(HttpContext context, WebSocket webSocket)
        {
            var userId = context.Items["userId"]?.ToString();
            if (string.IsNullOrEmpty(userId))
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "Falta el userId", CancellationToken.None);
                return;
            }

            // Guardamos la conexión
            _connections[userId] = webSocket;
            Console.WriteLine($"🔗 Usuario {userId} conectado");

            try
            {
                var messagesService = context.RequestServices.GetRequiredService<IMessagesService>();
                await messagesService.SendPendingMessagesAsync(userId);

                var buffer = new byte[4 * 1024];

                while (webSocket.State == WebSocketState.Open)
                {
                    var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Cierre normal", CancellationToken.None);
                        break;
                    }
                    if (result.MessageType != WebSocketMessageType.Text)
                        continue;

                    var json = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Dictionary<string, string> request = null;
                    try
                    {
                        request = JsonSerializer.Deserialize<Dictionary<string, string>>(json);
                    }
                    catch
                    {
                        await SendMessageToUser(userId,
                            JsonSerializer.Serialize(new { success = false, message = "❌ Formato JSON inválido." }));
                        continue;
                    }

                    if (request == null || !request.TryGetValue("action", out var action))
                    {
                        await SendMessageToUser(userId,
                            JsonSerializer.Serialize(new { success = false, message = "❌ Acción no especificada." }));
                        continue;
                    }

                    switch (action)
                    {
                        case "follow":
                            if (request.TryGetValue("targetUserId", out var tgt1)
                                && Guid.TryParse(tgt1, out var targetId)
                                && Guid.TryParse(userId, out var senderId))
                            {
                                var followService = context.RequestServices.GetRequiredService<IFollowService>();
                                await followService.FollowUserAsync(senderId, targetId);

                                var (followers, followings) = await followService.GetFollowCountsAsync(targetId);
                                var payload = JsonSerializer.Serialize(new
                                {
                                    action = "receive_counts",
                                    targetId,
                                    followers,
                                    followings
                                });

                                if (_countSubscribers.TryGetValue(targetId, out var bag))
                                {
                                    var targetIdStr = targetId.ToString();
                                    foreach (var subscriberId in bag.Distinct())
                                    {
                                        if (subscriberId == targetIdStr)
                                            continue;
                                        await SendMessageToUser(subscriberId, payload);
                                    }
                                }
                            }
                            else
                            {
                                await SendMessageToUser(userId,
                                    JsonSerializer.Serialize(new
                                    {
                                        success = false,
                                        action = "follow",
                                        message = "Parámetros inválidos para follow."
                                    }));
                            }
                            break;

                        case "send_message":
                            if (request.TryGetValue("receiverId", out var recv)
                                && Guid.TryParse(recv, out var receiverId)
                                && Guid.TryParse(userId, out var senderChatId)
                                && request.TryGetValue("content", out var content))
                            {
                                var messageService = context.RequestServices.GetRequiredService<IMessagesService>();
                                await messageService.SendMessageAsync(senderChatId, receiverId, content);
                            }
                            else
                            {
                                await SendMessageToUser(userId,
                                    JsonSerializer.Serialize(new
                                    {
                                        success = false,
                                        action = "send_message",
                                        message = "Parámetros inválidos para send_message."
                                    }));
                            }
                            break;

                        case "mark_as_read":
                            if (request.TryGetValue("contactId", out var cid)
                                && Guid.TryParse(cid, out var contactId)
                                && Guid.TryParse(userId, out var currentUserId))
                            {
                                var messageService = context.RequestServices.GetRequiredService<IMessagesService>();
                                await messageService.MarkMessagesAsReadAsync(currentUserId, contactId);
                                await SendMessageToUser(userId,
                                    JsonSerializer.Serialize(new
                                    {
                                        action = "mark_as_read",
                                        message = "Mensajes marcados como leídos."
                                    }));
                            }
                            else
                            {
                                await SendMessageToUser(userId,
                                    JsonSerializer.Serialize(new
                                    {
                                        success = false,
                                        action = "mark_as_read",
                                        message = "Parámetros inválidos para mark_as_read."
                                    }));
                            }
                            break;

                        case "subscribe_counts":
                            if (request.TryGetValue("targetUserId", out var tgt2)
                                && Guid.TryParse(tgt2, out var targetCountId))
                            {
                                var subs = _countSubscribers.GetOrAdd(targetCountId, _ => new ConcurrentBag<string>());
                                subs.Add(userId);

                                var followService2 = context.RequestServices.GetRequiredService<IFollowService>();
                                var (followers2, followings2) = await followService2.GetFollowCountsAsync(targetCountId);
                                var initialPayload = JsonSerializer.Serialize(new
                                {
                                    action = "receive_counts",
                                    targetId = targetCountId,
                                    followers = followers2,
                                    followings = followings2
                                });
                                await SendMessageToUser(userId, initialPayload);
                            }
                            else
                            {
                                await SendMessageToUser(userId,
                                    JsonSerializer.Serialize(new
                                    {
                                        success = false,
                                        action = "subscribe_counts",
                                        message = "targetUserId inválido."
                                    }));
                            }
                            break;

                        case "unfollow":
                            if (request.TryGetValue("targetUserId", out var tgtUn)
                                && Guid.TryParse(tgtUn, out var targetUnId)
                                && Guid.TryParse(userId, out var senderUnId))
                            {
                                var followServiceUn = context.RequestServices.GetRequiredService<IFollowService>();
                                await followServiceUn.UnfollowUserAsync(senderUnId, targetUnId);

                                var (followersUn, followingsUn) = await followServiceUn.GetFollowCountsAsync(targetUnId);
                                var payloadUn = JsonSerializer.Serialize(new
                                {
                                    action = "receive_counts",
                                    targetId = targetUnId,
                                    followers = followersUn,
                                    followings = followingsUn
                                });

                                if (_countSubscribers.TryGetValue(targetUnId, out var subsUn))
                                {
                                    var targetStr = targetUnId.ToString();
                                    foreach (var subscriberId in subsUn.Distinct())
                                    {
                                        if (subscriberId == targetStr)
                                            continue;

                                        await SendMessageToUser(subscriberId, payloadUn);
                                    }
                                }
                            }
                            else
                            {
                                await SendMessageToUser(userId,
                                    JsonSerializer.Serialize(new
                                    {
                                        success = false,
                                        action = "unfollow",
                                        message = "Parámetros inválidos para unfollow."
                                    }));
                            }
                            break;


                        default:
                            await SendMessageToUser(userId,
                                JsonSerializer.Serialize(new { success = false, message = "❌ Acción no reconocida." }));
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error WS para usuario {userId}: {ex}");
            }
            finally
            {
                _connections.TryRemove(userId, out _);
                if (webSocket.State == WebSocketState.Open)
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Cierre en finally", CancellationToken.None);
                Console.WriteLine($"❌ Usuario {userId} desconectado");
            }
        }

        public async Task<bool> SendMessageToUser(string userId, string message)
        {
            if (_connections.TryGetValue(userId, out var socket) &&
                socket.State == WebSocketState.Open)
            {
                var data = Encoding.UTF8.GetBytes(message);
                await socket.SendAsync(data, WebSocketMessageType.Text, true, CancellationToken.None);
                return true;
            }
            return false;
        }
    }
}
