// 모델-뷰-컨트롤러에서 컨트롤러 역할
// 외부에서 들어오는 요청을 라우팅하고, DB와 연결되는 처리 담당
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Dtos;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/todo 로 매핑됨
    public class TodoController : ControllerBase
    {
        private readonly AppDbContext _context;

        // 의존성 주입 (DbContext) - 느슨한 결합을 위해 사용
        public TodoController(AppDbContext context)
        {
            _context = context;
        }

        //  GET: api/todo
        // 할 일 목록 전체 조회
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
        {
            try
            {
                return await _context.Todos.OrderBy(t => t.Id).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(" GET エラー: " + ex.ToString()); // 로그 스트리밍에 출력됨
                return StatusCode(500, "Internal Server Error");
            }
        }
        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                await _context.Database.OpenConnectionAsync();
                Console.WriteLine("DB連結成功");
                await _context.Database.CloseConnectionAsync();
                return Ok("DB 연결 성공");
            }
            catch (Exception ex)
            {
                Console.WriteLine("DB連結 失敗: " + ex.ToString());
                return StatusCode(500, "DB連結 失敗");
            }
        }
        //  POST: api/todo
        // 새로운 할 일 추가
        [HttpPost]
        public async Task<ActionResult<Todo>> CreateTodo([FromBody] CreateTodoDto dto)
        {
            try
            {
                // 기본 검증
                if (string.IsNullOrEmpty(dto.Content))
                    return BadRequest("Content is required.");
                if (dto.StartDate == null || dto.EndDate == null)
                    return BadRequest("StartDate and EndDate are required.");

                // DTO → Entity 변환
                var todo = new Todo
                {
                    Content = dto.Content,
                    Status = dto.Status,
                    StartDate = dto.StartDate.Value,
                    EndDate = dto.EndDate.Value,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Todos.Add(todo); // DB에 등록
                await _context.SaveChangesAsync(); // 저장

                // 201 Created 응답 + 등록된 리소스 반환
                return CreatedAtAction(nameof(GetTodos), new { id = todo.Id }, todo);
            }
            catch (Exception ex)
            {
                Console.WriteLine("POST エラー: " + ex.ToString()); // 예외 로그 출력
                return StatusCode(500, "Internal Server Error");
            }
        }

        //  PUT: api/todo/{id}
        // 특정 할 일 수정
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] CreateTodoDto dto)
        {
            try
            {
                var todo = await _context.Todos.FindAsync(id);
                if (todo == null) return NotFound(); // 해당 ID 없음

                // 변경 값 적용
                todo.Content = dto.Content;
                todo.Status = dto.Status;
                if (dto.StartDate != null) todo.StartDate = dto.StartDate.Value;
                if (dto.EndDate != null) todo.EndDate = dto.EndDate.Value;
                todo.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync(); // 저장
                return NoContent(); // 204 응답
            }
            catch (Exception ex)
            {
                Console.WriteLine("PUT エラー: " + ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
        }

        //  DELETE: api/todo/{id}
        // 특정 할 일 삭제
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            try
            {
                var todo = await _context.Todos.FindAsync(id);
                if (todo == null) return NotFound();

                _context.Todos.Remove(todo);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine(" DELETE エラー: " + ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
