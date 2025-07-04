// 外部からのリクエストをルーティングし、DBと連携する処理を行う

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Dtos;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class TodoController : ControllerBase
    {
        private readonly AppDbContext _context;

        // DI（依存性注入）によってDbContextを受け取る。疎結合のために使用。
        public TodoController(AppDbContext context)
        {
            _context = context;
        }

        // Todo一覧の取得
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
        {
            try
            {
                return await _context.Todos.OrderBy(t => t.Id).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("GET エラー: " + ex.ToString()); 
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DB接続テスト用エンドポイント
        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                await _context.Database.OpenConnectionAsync();
                Console.WriteLine("DB接続成功");
                await _context.Database.CloseConnectionAsync();
                return Ok("DB接続成功");
            }
            catch (Exception ex)
            {
                Console.WriteLine("DB接続失敗: " + ex.ToString());
                return StatusCode(500, "DB接続失敗");
            }
        }

        // 新しいTodoを追加
        [HttpPost]
        public async Task<ActionResult<Todo>> CreateTodo([FromBody] CreateTodoDto dto)
        {
            try
            {
                // バリデーション
                if (string.IsNullOrEmpty(dto.Content))
                    return BadRequest("Contentは必須です。");
                if (dto.StartDate == null || dto.EndDate == null)
                    return BadRequest("開始日と終了日は必須です。");

                // DTO → Entity 変換
                var todo = new Todo
                {
                    Content = dto.Content,
                    Status = dto.Status,
                    StartDate = dto.StartDate.Value,
                    EndDate = dto.EndDate.Value,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Todos.Add(todo); // DBに追加
                await _context.SaveChangesAsync(); // 保存

                return CreatedAtAction(nameof(GetTodos), new { id = todo.Id }, todo);
            }
            catch (Exception ex)
            {
                Console.WriteLine("POST エラー: " + ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
        }

        // 指定したTodoの更新
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] CreateTodoDto dto)
        {
            try
            {
                var todo = await _context.Todos.FindAsync(id);
                if (todo == null) return NotFound();

                // 値の更新
                todo.Content = dto.Content;
                todo.Status = dto.Status;
                if (dto.StartDate != null) todo.StartDate = dto.StartDate.Value;
                if (dto.EndDate != null) todo.EndDate = dto.EndDate.Value;
                todo.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine("PUT エラー: " + ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
        }

        // 指定したTodoの削除
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
                Console.WriteLine("DELETE エラー: " + ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
