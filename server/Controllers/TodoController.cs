// POST: api/todo
[HttpPost]
public async Task<ActionResult<Todo>> CreateTodo([FromBody] TodoDto dto)
{
    if (string.IsNullOrEmpty(dto.Content))
        return BadRequest("Content is required.");

    if (dto.StartDate == null || dto.EndDate == null)
        return BadRequest("StartDate and EndDate are required.");

    try
    {
        var todo = new Todo
        {
            Content = dto.Content,
            Status = dto.Status,
            StartDate = dto.StartDate.Value, // ❗ 명시적 형변환 (nullable → non-nullable)
            EndDate = dto.EndDate.Value,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodos), new { id = todo.Id }, todo);
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error during SaveChanges: " + ex.Message);
        return StatusCode(500, "Internal Server Error");
    }
}

// PUT: api/todo/{id}
[HttpPut("{id}")]
public async Task<IActionResult> UpdateTodo(int id, [FromBody] TodoDto dto)
{
    //orm 으로 아이디가 있는 그 컨텐츠 내용을 가져오고 바 고칠수 있으면 고치기
    var todo = await _context.Todos.FindAsync(id);
    // 없으면 낫파운드
    if (todo == null) return NotFound();

    // 조회한 데이터에 대해서 업데이티드 데이터로 바꾼다 (더티 체킹)
    todo.Content = dto.Content;
    todo.Status = dto.Status;

    // ❗ nullable 형을 .Value로 명시적 처리
    if (dto.StartDate != null) todo.StartDate = dto.StartDate.Value;
    if (dto.EndDate != null) todo.EndDate = dto.EndDate.Value;

    todo.UpdatedAt = DateTime.UtcNow;
    //여기서 커밋
    await _context.SaveChangesAsync();
    return NoContent();
}
