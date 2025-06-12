using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Models.Dtos;
using Backend.Models.Mappers;

namespace Backend.Services
{
    public class UserService
    {
        private readonly UnitOfWork _unitOfWork;

        public UserService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid id)
        {
            User? user = await _unitOfWork.UserRepository.GetUserDataByIdAsync(id);
            return user != null ? UserMapper.ToDto(user) : null;
        }

        public async Task<UserDto?> GetUserByMailAsync(string mail)
        {
            User? user = await _unitOfWork.UserRepository.GetByMailAsync(mail);
            return user != null ? UserMapper.ToDto(user) : null;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            IEnumerable<User> users = await _unitOfWork.UserRepository.GetAllAsync();
            return users.Select(user => UserMapper.ToDto(user));
        }

        public Task<bool> IsLoginCorrect(string mail, string password)
        {
            return _unitOfWork.UserRepository.IsLoginCorrect(mail.ToLowerInvariant(), password);
        }

        public async Task<User> InsertAsync(User user)
        {
            await _unitOfWork.UserRepository.InsertAsync(user);
            await _unitOfWork.SaveAsync();

            return user;
        }
        public async Task<User> InsertByMailAsync(RegisterRequest userRequest)
        {
            User newUser = new User
            {
                Id = Guid.NewGuid(),
                Mail = userRequest.Mail.ToLowerInvariant(),
                Password = AuthService.HashPassword(userRequest.Password),
                Name = userRequest.Name,
                Phone = userRequest.Phone,
                Role = Role.User
            };

            return await InsertAsync(newUser);
        }

        public async Task<User?> UpdateUserAsync(Guid id, UpdateUserRequest request)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            if (request.Mail != null)
            {
                user.Mail = request.Mail.ToLowerInvariant();
            }
            if (request.Name != null)
            {
                user.Name = request.Name;
            }
            if (request.LastName != null)
            {
                user.LastName = request.LastName;
            }
            if (request.Biography != null)
            {
                user.Biography = request.Biography;
            }
            if (request.School != null)
            {
                user.School = request.School;
            }
            if (request.Degree != null)
            {
                user.Degree = request.Degree;
            }
            if (request.Nationality != null)
            {
                user.Nationality = request.Nationality;
            }
            if (request.Phone != null)
            {
                user.Phone = request.Phone;
            }
            if (request.ErasmusCountry != null)
            {
                user.ErasmusCountry = request.ErasmusCountry;
            }
            if (request.City != null)
            {
                user.City = request.City;
            }
            if (request.ErasmusDate.HasValue)
            {
                user.ErasmusDate = request.ErasmusDate.Value;
            }
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                user.Password = AuthService.HashPassword(request.Password);
            }

            if (request.File != null)
            {
                try
                {
                    string imageName = request.Name ?? user.Name;
                    user.AvatarUrl = await StoreImageAsync(request.File, imageName);
                }
                catch (Exception ex)
                {
                    throw new Exception("Error al guardar la imagen: " + ex.Message);
                }
            }

            await _unitOfWork.UserRepository.UpdateAsync(user);
            bool saved = await _unitOfWork.SaveAsync();

            if (!saved)
                return null;

            var fullUser = await _unitOfWork.UserRepository.GetUserDataByIdAsync(id);
            return fullUser;
        }


        public async Task<UserDto?> UpdateUserSocialMediaAsync(Guid userId, List<SocialMediaLinkDto> linksDto)
        {
            var newLinks = linksDto.Select(dto => new SocialMediaLink
            {
                SocialMedia = dto.SocialMedia,
                Url = dto.Url
            }).ToList();

            await _unitOfWork.UserRepository.ReplaceSocialMediasAsync(userId, newLinks);
            await _unitOfWork.SaveAsync();

            var updated = await _unitOfWork.UserRepository.GetByIdWithSocialMediasAsync(userId);
            return updated == null ? null : UserMapper.ToDto(updated);
        }

        public async Task<UserDto?> UpdateUserLanguageAsync(Guid userId, List<UserLanguageDTO> languages)
        {
            var newLanguages = languages.Select(dto => new UserLanguage
            {
                Language = dto.Language,
                Level = dto.Level
            }).ToList();

            await _unitOfWork.UserRepository.ReplaceLanguagesAsync(userId, newLanguages);
            await _unitOfWork.SaveAsync();

            var updated = await _unitOfWork.UserRepository.GetByIdWithSocialMediasAsync(userId);
            return updated == null ? null : UserMapper.ToDto(updated);
        }

        public async Task<bool> DeleteAsyncUserById(Guid id)
        {
            User user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            await _unitOfWork.UserRepository.DeleteAsync(user);

            return await _unitOfWork.SaveAsync();
        }

        public async Task<string> StoreImageAsync(IFormFile file, string modelName)
        {
            var validImageTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };

            if (!validImageTypes.Contains(file.ContentType))
            {
                throw new ArgumentException("El archivo no es un formato de imagen válido.");
            }

            string fileExtension = Path.GetExtension(file.FileName);
            string fileName = modelName + fileExtension;

            string imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            string filePath = Path.Combine(imagesFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine("images", fileName).Replace("\\", "/");
        }

        public async Task<List<UserRelationDto>> GetFollowersAsync(Guid userId)
        {
            var users = await _unitOfWork.UserRepository.GetFollowersAsync(userId);
            return users.Select(u => new UserRelationDto
            {
                Id = u.Id,
                Name = u.Name,
                AvatarUrl = u.AvatarUrl,
                ErasmusCountry = u.ErasmusCountry,
                City = u.City
            }).ToList();
        }

        public async Task<List<UserRelationDto>> GetFollowingsAsync(Guid userId)
        {
            var users = await _unitOfWork.UserRepository.GetFollowingsAsync(userId);
            return users.Select(u => new UserRelationDto
            {
                Id = u.Id,
                Name = u.Name,
                AvatarUrl = u.AvatarUrl,
                ErasmusCountry = u.ErasmusCountry,
                City = u.City
            }).ToList();
        }

        public async Task<IEnumerable<string>> GetAllCountriesAsync()
        {
            return await _unitOfWork.UserRepository.GetAllCountriesAsync();
        }

        public async Task<IEnumerable<string>> GetCitiesByCountryAsync(string country)
        {
            return await _unitOfWork.UserRepository.GetCitiesByCountryAsync(country);
        }
    }
}
