using Backend.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using Backend.Models.Database;
using Backend.Models.Database.Entities;

namespace Backend.Services
{
    public class EventService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly string _imagesFolder;
        private readonly DataContext _dataContext;
        public EventService(UnitOfWork unitOfWork, DataContext dataContext)
        {
            _unitOfWork = unitOfWork;
            _imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "events");
            Directory.CreateDirectory(_imagesFolder);
            _dataContext = dataContext;
        }

        public async Task<EventDto> CreateAsync(EventCreateDto dto)
        {
            var ev = EventMapper.FromCreateDto(dto);
            ev.Id = Guid.NewGuid();
            ev.ImageUrl = await SaveImage(dto.ImageFile, ev.Id);

            await _unitOfWork.EventRepository.InsertAsync(ev);
            await _unitOfWork.SaveAsync();

            var creator = await _unitOfWork.UserRepository.GetByIdAsync(ev.CreatorId);
            if (creator != null)
            {
                _dataContext.Entry(creator)
                    .Collection(u => u.CreatedEvents)
                    .Load();

                creator.CreatedEvents.Add(ev);
                await _unitOfWork.UserRepository.UpdateAsync(creator);
                await _unitOfWork.SaveAsync();
            }

            return EventMapper.ToDto(ev, joined: true);
        }


        public async Task<IEnumerable<EventDto>> GetAllAsync(Guid? currentUserId = null)
        {
            var list = await _unitOfWork.EventRepository.GetAllWithRelationsAsync();
            return list.Select(e =>
                EventMapper.ToDto(e, e.Participants.Any(u => u.Id == currentUserId)));
        }

        public async Task<EventDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
        {
            var ev = await _unitOfWork.EventRepository.GetByIdWithRelationsAsync(id);
            if (ev == null) return null;
            return EventMapper.ToDto(ev, ev.Participants.Any(u => u.Id == currentUserId));
        }

        public async Task<EventDto?> UpdateAsync(Guid id, EventUpdateDto dto)
        {
            var ev = await _unitOfWork.EventRepository.GetByIdWithRelationsAsync(id);
            if (ev == null) return null;

            EventMapper.UpdateEntity(ev, dto);

            if (dto.ImageFile != null)
                ev.ImageUrl = await SaveImage(dto.ImageFile, ev.Id);

            await _unitOfWork.EventRepository.UpdateAsync(ev);
            await _unitOfWork.SaveAsync();
            return EventMapper.ToDto(ev, ev.Participants.Any(u => u.Id == ev.CreatorId));
        }

        public async Task<bool> DeleteEventAsync(Guid eventId, Guid userId)
        {
            try
            {
                return await _unitOfWork.EventRepository.DeleteEventAsync(eventId, userId);
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    "There was a problem deleting the event", ex);
            }
        }

        public async Task<bool> JoinAsync(Guid eventId, Guid userId)
        {
            var ev = await _unitOfWork.EventRepository.GetByIdWithRelationsAsync(eventId)
                     ?? throw new KeyNotFoundException("Evento no encontrado");

            if (ev.Participants.Any(u => u.Id == userId))
                return false;
            if (ev.MaxAttendees.HasValue && ev.AttendeesCount >= ev.MaxAttendees)
                throw new InvalidOperationException("Evento completo");

            var user = await _unitOfWork.UserRepository.GetByIdAsync(userId)
                       ?? throw new KeyNotFoundException("Usuario no encontrado");

            ev.Participants.Add(user);
            ev.AttendeesCount++;
            await _unitOfWork.EventRepository.UpdateAsync(ev);
            await _unitOfWork.SaveAsync();

            _dataContext.Entry(user)
                .Collection(u => u.ParticipatingEvents)
                .Load();

            user.ParticipatingEvents.Add(ev);
            await _unitOfWork.UserRepository.UpdateAsync(user);
            return await _unitOfWork.SaveAsync();
        }

        public async Task<bool> LeaveAsync(Guid eventId, Guid userId)
        {
            var ev = await _unitOfWork.EventRepository.GetByIdWithRelationsAsync(eventId)
                ?? throw new KeyNotFoundException("Evento no encontrado");

            var user = ev.Participants.SingleOrDefault(u => u.Id == userId);
            if (user == null) return false;

            ev.Participants.Remove(user);
            ev.AttendeesCount = Math.Max(0, ev.AttendeesCount - 1);

            await _unitOfWork.EventRepository.UpdateAsync(ev);
            return await _unitOfWork.EventRepository.SaveAsync();
        }

        private async Task<string> SaveImage(IFormFile file, Guid eventId)
        {
            var ext = Path.GetExtension(file.FileName);
            var name = $"event_{eventId}{ext}";
            var path = Path.Combine(_imagesFolder, name);

            using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/events/{name}";
        }

        public Task<IEnumerable<Event>> GetEventsByUserAsync(Guid userId)
        {
            return _unitOfWork.EventRepository.GetByUserAsync(userId);
        }
    }
}
