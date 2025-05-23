﻿using Backend.Models.Database.Entities;
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
                .SingleOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByIdWithSocialMediasAsync(Guid id)
        {
            return await _context.Users
                         .Include(u => u.SocialMedias)
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
    }
}
