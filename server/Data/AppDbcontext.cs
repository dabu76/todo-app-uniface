using Microsoft.EntityFrameworkCore;
using server.Models;
// 디비컨텍스트를 상속받는것 알리아스 (상속을 받는 역할만 하는거 )

namespace server.Data
{
    // 디비 컨텍스트는 의존성(외부에서 주입받는것)있는 라이브러리 
    // 디비에 접근하기 위한 커넥션 풀(디비에 한번에 들어올수있는 사람이 20명이라면 그럼 커넥션 풀이 20명인거임)을 만들어줌 
    // 웹서버는 프론트를 띄우는 페이지 
    // 웹어플리케이션은 동적으로 무언가를 만드는 페이지 ( 웹서버와 웹어플리케이션에대해서도 알아두기)
    // 쓰레드 풀과 커넥션 풀에대한 것도 공부 이게 와스 와 연결되어있음
    // 디비전반의 커넥션풀의 관리와 사용자에게 디비에 연결될수있게끔 도와줌
    // orm(뭐에 약어인지 찾아두기)은 백엔드에서의 언어를 데이터베이스에서 이해할수있게끔 만들어줌 셀렉트 로우쿼리를 안쓰고 데이터베이스에서 
    // 이해할수있게 함과 타입안정성을 만들기 
    // 컴파일(사이트를 읽는거)
    public class AppDbContext : DbContext
    {
        // 디비를 연결할때 옵션을 다 정해줄수 있음 그게 이곳 (옵션 주입)
        //디비컨텍스트를 만들때 이걸기준으로 만들게끔함
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        //여기서 디비를 투두스로 쓰겠다
        public DbSet<Todo> Todos { get; set; }
    }
}
