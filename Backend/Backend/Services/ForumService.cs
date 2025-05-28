using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.Database.Repositories;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Backend.Models.Mappers;

namespace Backend.Services;

public class ForumService : IForumService
{
    private readonly UnitOfWork _unitOfWork;
    public ForumService(UnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> CreateForumAsync(CreateForumDTO forumDto)
    {
        try
        {
            var forumEntity = ForumMapper.ToEntity(forumDto);
            await _unitOfWork.ForumRepository.CreateReviewAsync(forumEntity);
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception("Error al crear el Foro", ex);
        }
    }

    public async Task<IEnumerable<ForumDTO>> GetAllForumsAsync()
    {
        var forums = await _unitOfWork.ForumRepository.GetAllForumsAsync();
        var forumDTOs = new List<ForumDTO>();

        foreach (var forum in forums)
        {
            var forumDto = ForumMapper.ToDto(forum);
            var user = await _unitOfWork.UserRepository.GetUserDataByIdAsync(forum.CreatedBy);

            if (user != null)
            {
                forumDto.CreatorId = user.Id;
                forumDto.CreatorName = user.Name;
                forumDto.CreatorAvatar = user.AvatarUrl;
                forumDto.CreatorNationatility = user.Nationality;
            }
            else
            {
                forumDto.CreatorName = "Usuario desconocido";
                forumDto.CreatorAvatar = "default-avatar.png";
                forumDto.CreatorNationatility = "Nacionalidad desconocida";
            }

            forumDTOs.Add(forumDto);
        }

        return forumDTOs;
    }

    public async Task<ForumDTO> GetForumByIdAsync(Guid id)
    {
        var forum = await _unitOfWork.ForumRepository.GetForumByIdAsync(id);
        var forumDto = ForumMapper.ToDto(forum);

        var user = await _unitOfWork.UserRepository.GetUserDataByIdAsync(forum.CreatedBy);

        if (user != null)
        {
            forumDto.CreatorId = user.Id;
            forumDto.CreatorName = user.Name;
            forumDto.CreatorAvatar = user.AvatarUrl;
            forumDto.CreatorNationatility = user.Nationality;
        }
        else
        {
            forumDto.CreatorName = "Unknown User";
            forumDto.CreatorAvatar = "default-avatar.png";
            forumDto.CreatorNationatility = "Unknown Nationality";
        }

        return forumDto;
    }

    public async Task<bool> CreateThreadAsync(CreateForumThreadDTO threadDto)
    {
        try
        {
            ForumThread threadEntity = ForumMapper.ToEntity(threadDto);
            await _unitOfWork.ForumRepository.CreateThreadAsync(threadEntity);
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception("Error al crear el hilo", ex);
        }
    }

    public async Task<IEnumerable<ForumThreadDTO>> GetThreadsByForumIdAsync(Guid forumId)
    {
        var threads = await _unitOfWork.ForumRepository.GetThreadsByForumIdAsync(forumId);
        var threadDtos = new List<ForumThreadDTO>();

        foreach (var thread in threads)
        {
            var dto = ForumMapper.ToDto(thread);
            var user = await _unitOfWork.UserRepository.GetUserDataByIdAsync(thread.CreatedBy);

            if (user != null)
            {
                dto.CreatorName = user.Name;
                dto.CreatorAvatar = user.AvatarUrl;
                dto.CreatorNationatility = user.Nationality;
            }
            else
            {
                dto.CreatorName = "Unknown User";
                dto.CreatorAvatar = "default-avatar.png";
                dto.CreatorNationatility = "Unknown Nationality";
            }

            threadDtos.Add(dto);
        }

        return threadDtos;
    }

    public async Task<bool> CreateMessageAsync(CreateForumMessageDTO messageDto)
    {
        try
        {
            ForumMessages messageEntity = ForumMapper.ToEntity(messageDto);
            await _unitOfWork.ForumRepository.CreateMessageAsync(messageEntity);
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception("Error al crear el mensaje", ex);
        }
    }

    public async Task<IEnumerable<ForumMessageDTO>> GetMessagesByThreadIdAsync(Guid threadId)
    {
        var messages = await _unitOfWork.ForumRepository.GetMessagesByThreadIdAsync(threadId);
        var messageDtos = new List<ForumMessageDTO>();

        foreach (var msg in messages)
        {
            var dto = ForumMapper.ToDto(msg);

            var user = await _unitOfWork.UserRepository.GetUserDataByIdAsync(msg.CreatedBy);
            if (user != null)
            {
                dto.CreatorName = user.Name;
                dto.CreatorAvatar = user.AvatarUrl;
                dto.CreatorNationatility = user.Nationality;
            }
            else
            {
                dto.CreatorName = "Usuario desconocido";
                dto.CreatorAvatar = "default-avatar.png";
                dto.CreatorNationatility = "Nacionalidad desconocida";
            }

            messageDtos.Add(dto);
        }

        return messageDtos;
    }
    public async Task<IEnumerable<string>> GetAllCountriesAsync()
    {
        return await _unitOfWork.ForumRepository.GetAllCountriesAsync();
    }

    public async Task<bool> DeleteForumAsync(Guid forumId, Guid userId)
    {
        try
        {
            return await _unitOfWork.ForumRepository.DeleteForumAsync(forumId, userId);
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("There was a problem until the forum was being deleted", ex);
        }
    }

    public async Task<IEnumerable<Forum>> GetForumsByUserAsync(Guid userId)
    {
        return await _unitOfWork.ForumRepository.GetForumsByUserIdAsync(userId);
    }

}

