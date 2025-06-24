import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
//カレンダーライブラリ
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from "date-fns/locale";
import { forwardRef } from "react";
import confetti from "canvas-confetti";

import "./App.css";

function App() {
  //カレンダーライブラリ変数
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState([]);
  const nextId = useRef(1);
  const [error, setError] = useState("");
  const nowDate = new Date();
  const [editingId, setEditingId] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState(null);
  const [filter, setFilter] = useState("all");

  // カスタム入力フィールド
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
      className="datepicker-input"
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
      placeholder="予定日を選択してください"
    />
  ));
  //修正押すと対象のcontentをinputに変わるし内容を変数に保存
  const handleModify = (id, content, date) => {
    setEditingId(id);
    setEditContent(content);
    setEditDate(date);
  };
  //保存を押すとmodifyから貰う変数を実際のtodoに保存して変換
  const handleUpdate = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            content: editContent,
            selectedDate: editDate,
            updatedAt: new Date(),
          }
        : todo
    );
    setTodos(updatedTodos);
    setEditingId(null);
    setEditContent("");
    setEditDate(null);
  };
  // 削除ボタンを押すと、対象のTODOを除外する
  const handleDelete = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };
  //状態stateを変換
  const handleState = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        const newStatus = !todo.status;
        if (!todo.status && newStatus) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        return {
          ...todo,
          status: todo.status === true ? false : true,
          updatedAt: new Date(),
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };
  //TODO登録
  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim() === "" || !selectedDate) {
      setError("内容もしくは日付を入力してください");
      return;
    } else if (selectedDate < nowDate) {
      setError("過去の日付は設定できません");
    } else {
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
      setError("");
    }
  };
  //全件、完了、未完了押すとstateを設定
  const handleFilter = (e) => {
    setFilter(e);
  };
  //設定した変数でfilterを実行
  const filteredTodos = todos.filter((todo) => {
    if (filter === "done") return todo.status === true;
    if (filter === "undone") return todo.status === false;
    return true;
  });
  return (
    <div className="todo-container">
      <h1> TODOアプリ</h1>
      <div className="error">{error}</div>
      {/* TODO登録フォーム */}
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="内容（全角100文字以内）"
          maxLength={100}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/*カスタムカレンダー */}
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          locale={ja}
          dateFormat="yyyy年MM月dd日（eee）"
          customInput={<CustomInput />}
        />

        <button type="submit">登録</button>
      </form>

      {/* フィルター切り替えボタン */}
      <div className="filter-buttons">
        <button className="todo-Btn" onClick={() => handleFilter("all")}>
          全件
        </button>
        <button className="todo-Btn" onClick={() => handleFilter("undone")}>
          未完了のみ
        </button>
        <button className="todo-Btn" onClick={() => handleFilter("done")}>
          完了のみ
        </button>
      </div>

      {/* TODO一覧表示 */}
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            ) : (
              <p className={todo.status ? "done" : ""}>内容: {todo.content}</p>
            )}
            <p className={todo.status ? "done" : ""}>
              {todo.updatedAt > todo.createdAt ? "再修正日時:" : "登録日時:"}
              {new Intl.DateTimeFormat("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "short",
              }).format(todo.updatedAt)}
            </p>
            {editingId === todo.id ? (
              <DatePicker
                selected={editDate}
                onChange={(date) => setEditDate(date)}
                locale={ja}
                dateFormat="yyyy年MM月dd日（eee）"
                customInput={<CustomInput />}
              />
            ) : (
              <p className={todo.status ? "done" : ""}>
                予定日:
                {todo.selectedDate &&
                  new Intl.DateTimeFormat("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  }).format(todo.selectedDate)}
              </p>
            )}
            <div>
              <button
                className="todo-Btn "
                onClick={() => handleState(todo.id)}
              >
                {todo.status === false ? "完了" : "未完了"}
              </button>
              {editingId === todo.id ? (
                <button
                  className="todo-Btn"
                  onClick={() => handleUpdate(todo.id)}
                >
                  保存
                </button>
              ) : (
                <button
                  className="todo-Btn"
                  onClick={() => handleModify(todo.id, todo.content)}
                >
                  修正
                </button>
              )}
              <button
                className="todo-Btn del"
                onClick={() => handleDelete(todo.id)}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
