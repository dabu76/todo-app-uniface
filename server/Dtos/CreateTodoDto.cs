namespace server.Dtos
{
    public class TodoDto
    {
        public required string Content { get; set; }
        public bool Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
