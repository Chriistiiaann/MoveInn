using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models.Database.Repositories
{
    public class UserRepository : Repository<User>
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetUserDataByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.SocialMedias)
                .Include(u => u.Accommodations)
                .Include(u => u.Recommendations)
                .Include(u => u.CreatedEvents)
                .Include(u => u.ParticipatingEvents)
                .Include(u => u.Languages)
                .SingleOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByIdWithSocialMediasAsync(Guid id)
        {
            return await _context.Users
                         .Include(u => u.SocialMedias)
                         .SingleOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByIdWithLanguageAsync(Guid id)
        {
            return await _context.Users
                         .Include(u => u.Languages)
                         .SingleOrDefaultAsync(u => u.Id == id);
        }

        public async Task ReplaceSocialMediasAsync(Guid userId, List<SocialMediaLink> newLinks)
        {
            var existing = await _context.SocialMediaLinks
                                                 .Where(sm => sm.UserId == userId)
                                                 .ToListAsync();
            _context.SocialMediaLinks.RemoveRange(existing);

            foreach (var link in newLinks)
            {

                link.UserId = userId;
                _context.SocialMediaLinks.Add(link);
            }
        }

        public async Task ReplaceLanguagesAsync(Guid userId, List<UserLanguage> newLanguages)
        {
            var existing = await _context.UserLanguages
                                                 .Where(sm => sm.UserId == userId)
                                                 .ToListAsync();
            _context.UserLanguages.RemoveRange(existing);

            foreach (var language in newLanguages)
            {

                language.UserId = userId;
                _context.UserLanguages.Add(language);
            }
        }

        public async Task<User?> GetByMailAsync(string mail)
        {
            return await _context.Users
                .SingleOrDefaultAsync(u => u.Mail == mail);
        }

        public async Task<bool> IsLoginCorrect(string mail, string password)
        {
            var user = await GetByMailAsync(mail);
            if (user == null) return false;
            var hashed = AuthService.HashPassword(password);
            return user.Password == hashed;
        }

        public async Task<bool> ChangeRoleAsync(Guid userId, Role newRole)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;
            user.Role = newRole;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<User>> GetFollowersAsync(Guid userId)
        {
            return await _context.Follows
                .Where(f => f.FollowingId == userId)
                .Select(f => f.Follower)
                .ToListAsync();
        }

        public async Task<List<User>> GetFollowingsAsync(Guid userId)
        {
            return await _context.Follows
                .Where(f => f.FollowerId == userId)
                .Select(f => f.Following)
                .ToListAsync();
        }
    }
}
