using server.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            // 여기에 프론트엔드 앱이 실행되는 모든 주소를 추가합니다.
            // 1. 로컬 React 앱의 주소 (예: http://localhost:3000 또는 http://localhost:5173)
            // 2. 나중에 React 앱이 Azure에 배포될 실제 주소 (예: https://your-frontend-app.azurestaticapps.net)
            // 3. (선택 사항) 개발 중 백엔드 자체의 Swagger UI 등을 위해 백엔드 URL도 포함할 수 있습니다.
            policy.WithOrigins("http://localhost:3000", // React 앱이 3000번 포트에서 실행된다면 추가
                               "http://localhost:5173", // 기존 포트 유지 (확인 후 필요 없으면 삭제 가능)
                               "https://webapp-todo-e4e7dphfcyb2e6ae.canadacentral-01.azurewebsites.net") // 백엔드 앱의 자체 URL (Swagger UI 등 접근용)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
                  // .AllowCredentials(); // 만약 쿠키나 인증 헤더를 사용하는 요청이 있다면 이 줄의 주석을 해제합니다.
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend"); // 정의된 "AllowFrontend" 정책을 사용합니다.
app.UseAuthorization();
app.MapControllers();

app.Run();
