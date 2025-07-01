using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using server.Data;
//서버 연결해주는걸
namespace server.Data
{
	public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
	{
		public AppDbContext CreateDbContext(string[] args)
		{
			var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseNpgsql("Host=uni-todo.postgres.database.azure.com;Port=5432;Database=ToDo;Username=postgres;Password=Whghtjd12;SSL Mode=Require;Trust Server Certificate=true;");

            return new AppDbContext(optionsBuilder.Options);
		}
	}
}
