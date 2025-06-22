import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
//カレンダーライブラリ
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from "date-fns/locale";

import "./App.css";

function App() {
  //カレンダーライブラリ変数
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("incomplete");
  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState([]);
  const nextId = useRef(1);

  const handleDelete = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);

    setTodos(newTodos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTodo = {
      id: nextId.current,
      content,
      status,
      selectedDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    nextId.current += 1;

    setTodos([...todos, newTodo]);
    setContent("");
    setSelectedDate(null);
  };
  return (
    <div className="todo-container">
      <h1> TODOアプリ</h1>

      {/* TODO登録フォーム */}
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="内容（全角100文字以内）"
          maxLength={100}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/*カスタムカレンダー */}
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          locale={ja}
          dateFormat="yyyy年MM月dd日（eee）"
          placeholderText="予定日を選択してください"
        />

        <button type="submit">登録</button>
      </form>

      {/* フィルター切り替えボタン */}
      <div className="filter-buttons">
        <button>全件</button>
        <button>未完了のみ</button>
        <button>完了のみ</button>
      </div>

      {/* TODO一覧表示 */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <p>内容: {todo.content}</p>
            <p>状態: {todo.status === "complete" ? "完了" : "未完了"}</p>
            <p>
              予定日:
              {todo.selectedDate &&
                new Intl.DateTimeFormat("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                }).format(todo.selectedDate)}
              <div>
                <button className="todo-Btn">完了</button>
                <button className="todo-Btn modify">修正</button>
                <button
                  className="todo-Btn del"
                  onClick={() => handleDelete(todo.id)}
                >
                  削除
                </button>
              </div>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
