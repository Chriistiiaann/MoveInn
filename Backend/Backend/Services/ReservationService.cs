using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Mappers;

namespace Backend.Services
{
    public class ReservationService
    {
        private readonly UnitOfWork _unitOfWork;

        public ReservationService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
       
        public async Task<ReservationDto?> CreateReservationAsync(ReservationCreateRequest request)
        {
            var accomodation = await _unitOfWork.AccommodationRepository.GetByIdAsync(request.AccommodationId);
            if (accomodation == null)
            {
                throw new Exception("Alojamiento no encontrado.");
            }

            var existingReservations = await _unitOfWork.ReservationRepository
                .GetReservationsByAccommodationIdAsync(request.AccommodationId);


            bool solapado = existingReservations.Any(r => r.StartDate < request.EndDate && r.EndDate > request.StartDate);
            if (solapado)
            {
                throw new Exception("El alojamiento ya está reservado en el periodo seleccionado.");
            }

            TimeSpan duration = request.EndDate - request.StartDate;
            decimal months = (decimal)(duration.TotalDays / 30.0);
            decimal totalPrice = Math.Round(months * accomodation.PricePerMonth, 2);

            var reservation = ReservationMapper.ToEntity(request);
            reservation.TotalPrice = totalPrice;

            await _unitOfWork.ReservationRepository.InsertAsync(reservation);
            await _unitOfWork.SaveAsync();
            return ReservationMapper.ToDto(reservation);
        }

        public async Task<ReservationDto?> GetReservationByIdAsync(Guid id)
        {
            var reservation = await _unitOfWork.ReservationRepository.GetByIdAsync(id);
            return reservation != null ? ReservationMapper.ToDto(reservation) : null;
        }

        public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync()
        {
            var reservations = await _unitOfWork.ReservationRepository.GetAllAsync();
            return reservations.Select(r => ReservationMapper.ToDto(r));
        }

        public async Task<ReservationDto?> UpdateReservationAsync(Guid id, ReservationUpdateRequest request)
        {
            var reservation = await _unitOfWork.ReservationRepository.GetByIdAsync(id);
            if (reservation == null) return null;

            ReservationMapper.UpdateEntity(reservation, request);
            await _unitOfWork.ReservationRepository.UpdateAsync(reservation);
            bool saved = await _unitOfWork.SaveAsync();
            return saved ? ReservationMapper.ToDto(reservation) : null;
        }

        public async Task<bool> DeleteReservationAsync(Guid reservationId, Guid userId)
        {
            try
            {
                return await _unitOfWork.ReservationRepository.DeleteReservationAsync(reservationId, userId);
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("There was a problem deleting the reservation", ex);
            }
        }

        public async Task<IEnumerable<ReservationDto>> GetReservationsByUserAsync(Guid userId)
        {
            var reservations = await _unitOfWork.ReservationRepository.GetByUserAsync(userId);
            return reservations.Select(r => ReservationMapper.ToDto(r));
        }
    }
}
