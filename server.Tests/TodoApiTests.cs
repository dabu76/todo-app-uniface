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

        // 新しいTODOを登録したときに、201 Created が返されるかを確認するテスト
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

        // TODOリストを取得したときに、200 OK が返されるかを確認するテスト
        [Fact]
        public async Task GetTodos_Returns_OK()
        {
            var response = await _client.GetAsync("/api/todo");

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        }

        // 登録したTODOを更新し、204 No Content が返されるかを確認するテスト
        [Fact]
        public async Task PutTodo_Returns_NoContent()
        {
            // まず新しいTODOを登録
            var newTodo = new
            {
                content = "Put Test",
                status = false,
                startDate = DateTime.UtcNow,
                endDate = DateTime.UtcNow.AddDays(1)
            };
            var postContent = new StringContent(JsonSerializer.Serialize(newTodo), Encoding.UTF8, "application/json");
            var postResponse = await _client.PostAsync("/api/todo", postContent);
            postResponse.EnsureSuccessStatusCode();

            // 登録されたIDを取得
            var createdJson = await postResponse.Content.ReadAsStringAsync();
            var created = JsonDocument.Parse(createdJson);
            var id = created.RootElement.GetProperty("id").GetInt32();

            // 更新処理
            var updatedTodo = new
            {
                content = "Updated Content",
                status = true,
                startDate = DateTime.UtcNow.AddDays(2),
                endDate = DateTime.UtcNow.AddDays(3)
            };
            var putContent = new StringContent(JsonSerializer.Serialize(updatedTodo), Encoding.UTF8, "application/json");
            var putResponse = await _client.PutAsync($"/api/todo/{id}", putContent);

            putResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
        }

        // 登録されたTODOを削除し、204 No Content が返されるかを確認するテスト
        [Fact]
        public async Task DeleteTodo_Returns_NoContent()
        {
            // まず新しいTODOを登録
            var newTodo = new
            {
                content = "Delete Test",
                status = false,
                startDate = DateTime.UtcNow,
                endDate = DateTime.UtcNow.AddDays(1)
            };
            var postContent = new StringContent(JsonSerializer.Serialize(newTodo), Encoding.UTF8, "application/json");
            var postResponse = await _client.PostAsync("/api/todo", postContent);
            postResponse.EnsureSuccessStatusCode();

            // 登録されたIDを取得
            var createdJson = await postResponse.Content.ReadAsStringAsync();
            var created = JsonDocument.Parse(createdJson);
            var id = created.RootElement.GetProperty("id").GetInt32();

            // 削除処理
            var deleteResponse = await _client.DeleteAsync($"/api/todo/{id}");

            deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
        }
    }
}
