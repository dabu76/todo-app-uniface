import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
//カレンダーライブラリ
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from "date-fns/locale";
import { forwardRef } from "react";
import confetti from "canvas-confetti";
import axios from "axios";
import "./App.css";

function App() {
  //カレンダーライブラリ変数
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(false);
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [todos, setTodos] = useState([]);
  const nextId = useRef(1);
  const [error, setError] = useState("");
  const nowDate = new Date();
  const [editingId, setEditingId] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState([null, null]);
  const [filter, setFilter] = useState("undone");

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
  const handleModify = (id, content, startDate, endDate) => {
    setEditingId(id);
    setEditContent(content);
    setEditDate([startDate, endDate]);
  };
  //保存を押すとmodifyから貰う変数を実際のtodoに保存して変換
  const handleUpdate = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            content: editContent,
            startDate: editDate[0],
            endDate: editDate[1],
            updatedAt: new Date(),
          }
        : todo
    );
    setTodos(updatedTodos);
    setEditingId(null);
    setEditContent("");
    setEditDate([null, null]);
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
  //時間を今日の12時に設定
  const isSameOrBeforeToday = (inputDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 今日を 00:00:00で リセット
    const target = new Date(inputDate);
    target.setHours(0, 0, 0, 0);
    return target < today;
  };
  //TODO登録
  const handleSubmit = (e) => {
    e.preventDefault();
    //内容を書いてない場合
    if (
      content.trim() === "" ||
      !Array.isArray(selectedDate) ||
      !selectedDate[0]
    ) {
      setError("内容もしくは日付を入力してください");
      return;
      //過去日の場合
    } else if (isSameOrBeforeToday(selectedDate[0])) {
      setError("過去の日付は設定できません");
    } else {
      const newTodo = {
        id: nextId.current,
        content,
        status,
        startDate: selectedDate[0],
        endDate: selectedDate[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      nextId.current += 1;

      setTodos([...todos, newTodo]);
      setContent("");
      setSelectedDate([null, null]);
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
          selectsRange
          startDate={Array.isArray(selectedDate) ? selectedDate[0] : null}
          endDate={Array.isArray(selectedDate) ? selectedDate[1] : null}
          onChange={(update) => setSelectedDate(update)}
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
          <li className={editingId === todo.id ? "editing" : ""} key={todo.id}>
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
                selectsRange
                startDate={Array.isArray(editDate) ? editDate[0] : null}
                endDate={Array.isArray(editDate) ? editDate[1] : null}
                onChange={(update) => setEditDate(update)}
                locale={ja}
                dateFormat="yyyy年MM月dd日（eee）"
                customInput={<CustomInput />}
              />
            ) : (
              <p className={todo.status ? "done" : ""}>
                予定日:
                {todo.startDate &&
                  new Intl.DateTimeFormat("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  }).format(new Date(todo.startDate))}
                {todo.endDate && todo.startDate !== todo.endDate && (
                  <>
                    {" ～ "}
                    {new Intl.DateTimeFormat("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    }).format(new Date(todo.endDate))}
                  </>
                )}
              </p>
            )}
            <div>
              <button
                className={`todo-Btn ${editingId === todo.id ? "hide" : ""}`}
                onClick={() => handleState(todo.id)}
              >
                {todo.status === false ? "完了" : "未完了"}
              </button>
              {editingId === todo.id ? (
                <button
                  className="todo-Btn complete"
                  onClick={() => handleUpdate(todo.id)}
                >
                  保存
                </button>
              ) : (
                <button
                  className="todo-Btn"
                  onClick={() =>
                    handleModify(
                      todo.id,
                      todo.content,
                      todo.startDate,
                      todo.endDate
                    )
                  }
                >
                  修正
                </button>
              )}
              <button
                className={`todo-Btn del ${
                  editingId === todo.id ? "hide" : ""
                }`}
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
