import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "../components/TodoItem";

describe("TodoItem", () => {
  // テスト用のフォーム
  const mockTodo = {
    id: 1,
    content: "掃除",
    status: false,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // テスト用のToDoデータ
  const props = {
    todo: mockTodo,
    editingId: null,
    editContent: "",
    editDate: [null, null],
    setEditContent: vi.fn(),
    setEditDate: vi.fn(),
    handleUpdate: vi.fn(),
    handleDelete: vi.fn(),
    handleState: vi.fn(),
    handleModify: vi.fn(),
  };

  beforeEach(() => {
    render(<TodoItem {...props} />);
  });

  // ToDo内容が正しく表示されることを確認するテスト
  it("renders todo content", () => {
    expect(screen.getByText(/内容: 掃除/)).toBeTruthy();
  });

  // 「削除」ボタン押下で handleDelete が呼び出されることを確認するテスト
  it("calls handleDelete when 削除 button is clicked", () => {
    const deleteBtn = screen.getByRole("button", { name: "削除" });
    fireEvent.click(deleteBtn);
    expect(props.handleDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  // 「完了」ボタン押下で handleState が呼び出されることを確認するテスト
  it("calls handleState when 完了 button is clicked", () => {
    const completeBtn = screen.getByRole("button", { name: "完了" });
    fireEvent.click(completeBtn);
    expect(props.handleState).toHaveBeenCalledWith(mockTodo.id);
  });

  // 「修正」ボタン押下で handleModify が正しい引数で呼び出されることを確認するテスト
  it("calls handleModify when 修正 button is clicked", () => {
    const modifyBtn = screen.getByRole("button", { name: "修正" });
    fireEvent.click(modifyBtn);
    expect(props.handleModify).toHaveBeenCalledWith(
      mockTodo.id,
      mockTodo.content,
      mockTodo.startDate,
      mockTodo.endDate
    );
  });
});
