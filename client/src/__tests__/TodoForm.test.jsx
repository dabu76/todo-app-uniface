import { render, screen, fireEvent } from "@testing-library/react";
import TodoForm from "../components/TodoForm";

describe("TodoForm", () => {
  // テスト用のモック関数
  const mockHandleSubmit = vi.fn();
  const mockSetContent = vi.fn();
  const mockSetSelectedDate = vi.fn();

  // DatePickerコンポーネントをモック化して、実際のカレンダーUIを表示させずにinput要素として扱う
  vi.mock("react-datepicker", () => {
    const DatePicker = ({ onChange }) => (
      <input
        type="date"
        onChange={(e) => onChange([new Date(e.target.value), null])}
      />
    );
    return { default: DatePicker };
  });
  // 入力フィールドと登録ボタンが表示されることを確認するテスト
  it("renders input and submit button", () => {
    render(
      <TodoForm
        content=""
        setContent={mockSetContent}
        selectedDate={[null, null]}
        setSelectedDate={mockSetSelectedDate}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByPlaceholderText("内容（全角100文字以内）")).toBeTruthy();
    expect(screen.getByRole("button", { name: "登録" })).toBeTruthy();
  });

  // 入力時に setContent が呼び出されることを確認するテスト
  it("calls setContent when typing", () => {
    render(
      <TodoForm
        content=""
        setContent={mockSetContent}
        selectedDate={[null, null]}
        setSelectedDate={mockSetSelectedDate}
        handleSubmit={mockHandleSubmit}
      />
    );

    const input = screen.getByPlaceholderText("内容（全角100文字以内）");
    fireEvent.change(input, { target: { value: "勉強" } });

    expect(mockSetContent).toHaveBeenCalledWith("勉強");
  });

  // フォーム送信時に handleSubmit が呼ばれることを確認するテスト
  it("calls handleSubmit on form submit", () => {
    render(
      <TodoForm
        content="掃除"
        setContent={mockSetContent}
        selectedDate={[null, null]}
        setSelectedDate={mockSetSelectedDate}
        handleSubmit={mockHandleSubmit}
      />
    );

    const button = screen.getByRole("button", { name: "登録" });
    fireEvent.click(button);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
