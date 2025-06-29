//모델뷰컨트롤러로 api를 연동 해주는 역할 여기다가 뭘 적었을때 외부에서 신호를 받으면 여기서 라우팅을 통해 여기서 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Dtos; //  DTO 네임스페이스 추가

namespace server.Controllers
{
    [ApiController]
    // 패스이고 경로임 패스는 큰리소스 단위로 나눠져있어야함 http방식은 리소스에대한 명시를 패스에둔다 
    //http = 웹통신프로토콜 
    // rest-api = 소프트 아키텍쳐 소프트 웨어 간의 데이터를 잘 주고 받는 역할임 이거에대해서 다 잘 찾아보기 자원을 다루고있다 중요
    // 에이치티피피 상태 코드 하나하나 찾아보기 200 , 500 , 400 중요
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        // 디자인 패턴의 핵심 이걸 하는 이유는 커플링(결합도)를 낮추려고 컨트롤러가 디비컨텍스트에 연결이 되는건데 
        // 디비가 데이터베이스랑 완전히 똑같이 되어있으면 나중에 고치기도 더 어려워짐 (솔리드에대해서 찾아보기)
        private readonly AppDbContext _context;

        // ✔️ 의존성 주입 (DbContext) - 느슨한 결합, 테스트 용이성 향상
        public TodoController(AppDbContext context)
        {
            _context = context;
        }

        // 비동기 동기 아이오 씨피유 이게 어떤형식으로 흐름으로 이어지는지를 제대로 알아두기
        // GET: api/todo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
        {
            // 날짜 아이디 내림 차순으로 (EntityFrameworkCore 이거 함 찾아보기 문법 뭐뭐 있는지 찾아보기)
            return await _context.Todos.OrderBy(t => t.Id).ToListAsync();
        }

        //테이블에 하나하나 값을넣기 
        //포스트는 에이치티티피 바디를 가지고있음 겟은 바디를 가지고있지않기때문에 주소에다가 적어야함
        //http는 스스로 패스나 헤더등이 어떤역할을 하는지 알아야한다
        // POST: api/todo
        //프롬 바디 에는 내가 뭘적었는지가 들어가있음 쓰는 이유는 보안적인 부분과 길이 문제때문에 씀
        [HttpPost]
        public async Task<ActionResult<Todo>> CreateTodo([FromBody] TodoDto dto)
        {
            var todo = new Todo
            {
                Content = dto.Content,
                Status = dto.Status,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Todos.Add(todo); //orm 인서트
            //데이터베이스 커밋
            await _context.SaveChangesAsync();
            // 이걸 하면 성공적으로 만들어졌다는 리스폰스 (스테이터스 와 바디를 줌) 그리고 
            return CreatedAtAction(nameof(GetTodos), new { id = todo.Id }, todo);
        }

        // PUT: api/todo/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] TodoDto dto)
        {
            //orm 으로 아이디가 있는 그 컨텐츠 내용을 가져오고
            var todo = await _context.Todos.FindAsync(id);
            // 없으면 낫파운드
            if (todo == null) return NotFound();
            // 조회한 데이터에 대해서 업데이티드 데이터로 바꾼다 (더티 체킹)
            todo.Content = dto.Content;
            todo.Status = dto.Status;
            todo.StartDate = dto.StartDate;
            todo.EndDate = dto.EndDate;
            todo.UpdatedAt = DateTime.UtcNow;
            //여기서 커밋
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/todo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null) return NotFound();

            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
