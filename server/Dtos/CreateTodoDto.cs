// CreateTodoDto£º«¯«é«¤«¢«ó«Èª«ªéáêãáªµªìªëToDoíÂà÷«ê«¯«¨«¹«Èªòáôª±ö¢ªëª¿ªáªÎDTO£¨Data Transfer Object£©
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
