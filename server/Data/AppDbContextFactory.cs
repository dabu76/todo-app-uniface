using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using server.Data;

namespace server.Data
{
	public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
	{
		public AppDbContext CreateDbContext(string[] args)
		{
			var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
			optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=ToDo;Username=postgres;Password=whghtjd12");

			return new AppDbContext(optionsBuilder.Options);
		}
	}
}
