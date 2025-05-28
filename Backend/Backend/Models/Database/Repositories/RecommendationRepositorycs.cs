using Backend.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories
{
    public class RecommendationRepository : Repository<Recommendation>
    {
        private readonly DataContext _context;
        public RecommendationRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Recommendation?> GetByIdAsync(Guid id)
        {
            return await _context.Set<Recommendation>()
                .Include(r => r.RecommendationImages)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Recommendation>> GetAllAsync()
        {
            return await _context.Set<Recommendation>()
                .Include(r => r.RecommendationImages)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetAllCountriesAsync()
        {
            return await _context.Recommendations
                .Where(a => !string.IsNullOrEmpty(a.Country))
                .Select(a => a.Country)
                .Distinct()
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetCitiesByCountryAsync(string country)
        {
            return await _context.Recommendations
                .Where(a => a.Country == country && !string.IsNullOrEmpty(a.City))
                .Select(a => a.City)
                .Distinct()
                .ToListAsync();
        }

        public async Task InsertAsync(Recommendation recommendation)
        {
            await _context.Set<Recommendation>().AddAsync(recommendation);
        }

        public async Task UpdateAsync(Recommendation recommendation)
        {
            _context.Set<Recommendation>().Update(recommendation);
        }

        public async Task<bool> DeleteRecommendationAsync(Guid recommendationId, Guid userId)
        {
            var recommendation = await _context.Recommendations
                .Include(r => r.RecommendationImages)
                .FirstOrDefaultAsync(r => r.Id == recommendationId);

            if (recommendation == null)
                throw new KeyNotFoundException("This recommendation doesn't exists");

            if (recommendation.UserId != userId)
                return false;

            _context.Images.RemoveRange(recommendation.RecommendationImages);
            _context.Recommendations.Remove(recommendation);
            var changes = await _context.SaveChangesAsync();
            return changes > 0;
        }

        public async Task<IEnumerable<Recommendation>> GetByUserAsync(Guid userId)
        {
            return await _context.Recommendations
                .Include(r => r.User)
                .Include(r => r.RecommendationImages)
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }
    }
}
