using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Mappers;

namespace Backend.Services
{
    public class RecommendationService
    {
        private readonly UnitOfWork _unitOfWork;

        public RecommendationService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<RecommendationDto?> CreateRecommendationAsync(RecommendationCreateRequest request, Guid? userId = null)
        {
            var recommendation = RecommendationMapper.ToEntity(request);
            if (userId.HasValue)
            {
                recommendation.UserId = userId;
            }

            if (request.Files != null && request.Files.Any())
            {
                if (request.Files.Count > 5)
                {
                    throw new Exception("Solo se permiten hasta 5 imágenes por recomendación.");
                }
                foreach (var file in request.Files)
                {
                    string imageUrl = await StoreImageAsync(file, recommendation.Title);
                    recommendation.RecommendationImages.Add(new Image
                    {
                        Id = Guid.NewGuid(),
                        Url = imageUrl,
                        RecommendationId = recommendation.Id
                    });
                }
            }

            await _unitOfWork.RecommendationRepository.InsertAsync(recommendation);
            await _unitOfWork.SaveAsync();
            return RecommendationMapper.ToDto(recommendation);
        }

        public async Task<RecommendationDto?> GetRecommendationByIdAsync(Guid id)
        {
            var recommendation = await _unitOfWork.RecommendationRepository.GetByIdAsync(id);
            return recommendation != null ? RecommendationMapper.ToDto(recommendation) : null;
        }

        public async Task<IEnumerable<RecommendationDto>> GetAllRecommendationsAsync()
        {
            var recommendations = await _unitOfWork.RecommendationRepository.GetAllAsync();
            return recommendations.Select(r => RecommendationMapper.ToDto(r));
        }

        public async Task<IEnumerable<string>> GetAllCountriesAsync()
        {
            return await _unitOfWork.RecommendationRepository.GetAllCountriesAsync();
        }

        public async Task<IEnumerable<string>> GetCitiesByCountryAsync(string country)
        {
            return await _unitOfWork.RecommendationRepository.GetCitiesByCountryAsync(country);
        }

        public async Task<RecommendationDto?> UpdateRecommendationAsync(Guid id, RecommendationUpdateRequest request)
        {
            var recommendation = await _unitOfWork.RecommendationRepository.GetByIdAsync(id);
            if (recommendation == null) return null;
            RecommendationMapper.UpdateEntity(recommendation, request);
            await _unitOfWork.RecommendationRepository.UpdateAsync(recommendation);
            bool saved = await _unitOfWork.SaveAsync();
            return saved ? RecommendationMapper.ToDto(recommendation) : null;
        }

        public async Task<string> StoreImageAsync(IFormFile file, string fileNamePrefix)
        {
            var validImageTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!validImageTypes.Contains(file.ContentType))
            {
                throw new ArgumentException("El archivo no es un formato de imagen válido.");
            }

            string fileExtension = Path.GetExtension(file.FileName);
            string fileName = $"{fileNamePrefix}_{Guid.NewGuid()}{fileExtension}";
            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "recommendations");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            string filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine("recommendations", fileName).Replace("\\", "/");
        }

        public async Task<bool> DeleteRecommendationAsync(Guid recommendationId, Guid userId)
        {
            try
            {
                return await _unitOfWork.RecommendationRepository.DeleteRecommendationAsync(recommendationId, userId);
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("There was a problem deleting the recommendation", ex);
            }
        }

        public Task<IEnumerable<Recommendation>> GetRecommendationsByUserAsync(Guid userId)
        {
            return _unitOfWork.RecommendationRepository.GetByUserAsync(userId);
        }

    }
}
