using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    // データベースの「Todos」テーブルと1:1でマッピングされるEntityクラス
    public class Todo
    {
        public int Id { get; set; }
        public required string Content { get; set; }
        public bool Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
