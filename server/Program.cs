using server.Data;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // PostgreSQL 연결 문자열 설정
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        // CORS 정책 정의
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                policy =>
                {
                    policy.WithOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173",
                        "https://webapp-todo-e4e7dphfcyb2e6ae.canadacentral-01.azurewebsites.net"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
        });

        // 컨트롤러, Swagger 등 서비스 등록
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Swagger 설정 (개발 환경에서만)
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // 개발/운영 환경 모두에서 예외 상세 페이지 출력
        if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
        {
            app.UseDeveloperExceptionPage(); // 예외 로그 출력
        }

        // 정적 파일 처리
        app.UseDefaultFiles();
        app.UseStaticFiles();
        app.UseHttpsRedirection();
        //  라우팅 미들웨어 추가 (누락되면 API 동작 안 함)
        app.UseRouting();

        app.UseCors("AllowFrontend");
        app.UseAuthorization();

        // 컨트롤러 매핑 (API가 여기에 연결됨)
        app.MapControllers();

        app.Run();
    }
}
