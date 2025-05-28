using Backend.Models.Database.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Database.Entities
{
    public class Hosts
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        public string Reason { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public RequestStatus Status { get; set; } = RequestStatus.Pending;

        public DateTime? HostSince { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public ICollection<Speciality> Specialties { get; set; }= new List<Speciality>();
    }
}
