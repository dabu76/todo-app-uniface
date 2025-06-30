using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace server.Tests
{
    public class TodoApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public TodoApiTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }
        //포스트를 써서 에이피아이에다가 줘서 만들어지는지 테스트 함 지금 하난데 3개 (딜리트 업데이트 풋을 만들어서 컨트롤러에대한 
        //UT테스트를 완성하는게 좋을거같다
        [Fact]
        public async Task PostTodo_Returns_Created()
        {
            var newTodo = new
            {
                content = "Test Content",
                status = false,
                startDate = DateTime.UtcNow,
                endDate = DateTime.UtcNow.AddDays(1)
            };

            var content = new StringContent(JsonSerializer.Serialize(newTodo), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("/api/todo", content);

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Created);
        }
    }
}
