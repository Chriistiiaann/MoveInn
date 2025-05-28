using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Backend.Models.Database.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Models.Dtos
{
    public class UpdateUserRequest
    {
        [EmailAddress]
        public string? Mail { get; set; }

        public string? Password { get; set; }

        public string? Name { get; set; }

        public string? LastName { get; set; }

        public string? Biography { get; set; }

        public string? School { get; set; }

        public string? Degree { get; set; }

        public string? Nationality { get; set; }
        public string? City { get; set; }
        public string? ErasmusCountry { get; set; }
        public DateOnly? ErasmusDate { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public IFormFile? File { get; set; }
    }
}
