import { useEffect, useRef, useState } from "react";
import { isSameDay } from "date-fns";
import axios from "axios";
import confetti from "canvas-confetti";

// 分離されたコンポーネントの読み込み
import TodoItem from "./components/TodoItem";
import TodoForm from "./components/TodoForm";
import FilterButtons from "./components/FilterButtons";
import ErrorMessage from "./components/ErrorMessage";

// エラーメッセージ定数
import { ERROR_MESSAGES } from "./constants/messages";
import "./App.css";

function App() {
  // バックエンドサーバーのURL
  // AzureにデプロイされたバックエンドのURLに書き換えてください
  const API_BASE =
    "https://webapp-todo-e4e7dphfcyb2e6ae.canadacentral-01.azurewebsites.net/api/todo";

  // カレンダー関連の状態管理
  const [content, setContent] = useState(""); // 入力されたTODO内容
  const [status, setStatus] = useState(false); // 完了ステータス
  const [selectedDate, setSelectedDate] = useState([null, null]); // 予定日の範囲
  const [todos, setTodos] = useState([]); // すべてのTODO
  const [error, setError] = useState(""); // エラーメッセージ表示用
  const nowDate = new Date(); // 現在日時
  const [editingId, setEditingId] = useState(false); // 編集中のTODOのID
  const [editContent, setEditContent] = useState(""); // 編集用内容
  const [editDate, setEditDate] = useState([null, null]); // 編集用日付
  const [filter, setFilter] = useState("undone"); // フィルター状態

  // アプリ起動時にTODO一覧を取得
  useEffect(() => {
    axios
      .get(API_BASE)
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        console.error("読み込み失敗", err);
      });
  }, []);

  // 「修正」ボタン押下時、対象のデータを編集用ステートにセット
  const handleModify = (id, content, startDate, endDate) => {
    setEditingId(id);
    setEditContent(content);
    setEditDate([startDate, endDate]);
  };

  // 「保存」ボタン押下時、編集データを反映
  const handleUpdate = async (id) => {
    try {
      const updated = {
        content: editContent,
        startDate: editDate[0],
        endDate: editDate[1],
        updatedAt: nowDate,
      };
      // バックエンドにPUT送信
      await axios.put(`${API_BASE}/${id}`, {
        ...updated,
        status: todos.find((t) => t.id === id).status,
      });

      // フロント側でも状態更新
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, ...updated } : todo
      );
      setTodos(updatedTodos);
      setEditingId(null);
      setEditContent("");
      setEditDate([null, null]);
    } catch (err) {
      console.error("更新失敗", err);
    }
  };

  // 「削除」ボタン押下時、対象TODOを削除
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("削除失敗", err);
    }
  };

  // 「完了／未完了」トグル切り替え
  const handleState = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        const newStatus = !todo.status;
        if (!todo.status && newStatus) {
          // 完了時にお祝い演出
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        return {
          ...todo,
          status: newStatus,
          updatedAt: nowDate,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  // 指定日が今日より前かどうか判定
  const isSameOrBeforeToday = (inputDate) => {
    const today = nowDate;
    today.setHours(0, 0, 0, 0);
    const target = new Date(inputDate);
    target.setHours(0, 0, 0, 0);
    return target < today;
  };

  // TODO登録処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 内容が未入力または日付が未選択
    if (
      content.trim() === "" ||
      !Array.isArray(selectedDate) ||
      !selectedDate[0]
    ) {
      setError(ERROR_MESSAGES.EMPTY_INPUT);
      return;
    }
    // 過去日が選択された場合
    else if (isSameOrBeforeToday(selectedDate[0])) {
      setError(ERROR_MESSAGES.PAST_DATE);
      return;
    }
    //新しいTODOデータ
    const newTodo = {
      content,
      status,
      startDate: selectedDate[0],
      endDate: selectedDate[1],
    };

    try {
      // バックエンドへPOST送信
      const res = await axios.post(API_BASE, newTodo);
      setTodos([...todos, res.data]);
      setContent("");
      setSelectedDate([null, null]);
      setError("");
    } catch (err) {
      console.error("追加失敗", err);
    }
  };

  // フィルター状態を切り替え（全件／完了／未完了／本日）
  const handleFilter = (e) => {
    setFilter(e);
  };

  // 本日が期限のTODOを抽出
  const todayTodos = todos.filter((todo) =>
    isSameDay(new Date(todo.endDate), nowDate)
  );
  const todayCount = todayTodos.length;

  // フィルターに応じて表示するTODOを制御
  const filteredTodos = todos.filter((todo) => {
    if (filter === "done") return todo.status === true;
    if (filter === "undone") return todo.status === false;
    if (filter === "today") return todayTodos.includes(todo);
    return true;
  });

  return (
    <div className="todo-container">
      <div className="todo-container-header">
        <h1>
          TODOアプリ
          <p className="today_Btn" onClick={() => handleFilter("today")}>
            本日の業務 {todayCount}
          </p>
        </h1>
      </div>

      {/* エラーメッセージ表示 */}
      <ErrorMessage className="error" message={error} />

      {/* TODO登録フォーム */}
      <TodoForm
        content={content}
        setContent={setContent}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        handleSubmit={handleSubmit}
      />

      {/* フィルターボタン */}
      <FilterButtons onFilterChange={handleFilter} />

      {/* TODO一覧表示 */}
      <ul>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editingId={editingId}
            editContent={editContent}
            editDate={editDate}
            setEditContent={setEditContent}
            setEditDate={setEditDate}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            handleState={handleState}
            handleModify={handleModify}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
