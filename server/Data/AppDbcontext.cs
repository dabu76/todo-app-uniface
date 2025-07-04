using Microsoft.EntityFrameworkCore;
using server.Models;


namespace server.Data
{
    // DBとの接続を管理するためのクラス。EF CoreのDbContextを継承。
    public class AppDbContext : DbContext
    {
   
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<Todo> Todos { get; set; }
    }
}
