using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Todo
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; }

        public bool Status { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
