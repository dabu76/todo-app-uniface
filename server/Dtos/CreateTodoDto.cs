// CreateTodoDto�����髤����Ȫ������᪵���ToDo�����ꫯ�����Ȫ��������몿���DTO��Data Transfer Object��
namespace server.Dtos
{
    public class CreateTodoDto  
    {
        public required string Content { get; set; }
        public bool Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
