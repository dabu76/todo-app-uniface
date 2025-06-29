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
