using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    //디비가 가지고있는 테이블을 그대로 사용할수없기에 겟셋으로 엔티리모델로 1:1 모델로 매칭하기위함
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
