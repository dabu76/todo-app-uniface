import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale";
import { forwardRef } from "react";
import "react-datepicker/dist/react-datepicker.css";

// 日付ピッカー用のカスタム入力フィールド（forwardRefで参照を渡す）
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

// TODO項目を表示・編集・削除するためのコンポーネント
export default function TodoItem({
  todo,
  editingId,
  editContent,
  editDate,
  setEditContent,
  setEditDate,
  handleUpdate,
  handleDelete,
  handleState,
  handleModify,
}) {
  return (
    <li className={editingId === todo.id ? "editing" : ""}>
      {/* 内容（表示 or 編集） */}
      {editingId === todo.id ? (
        <input
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
      ) : (
        <p className={todo.status ? "done" : ""}>内容: {todo.content}</p>
      )}

      {/* 登録日時 or 更新日時 */}
      <p className={todo.status ? "done" : ""}>
        {todo.updatedAt !== todo.createdAt ? "登録日時 : " : "再修正日時 : "}
        {todo.startDate &&
          new Intl.DateTimeFormat("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          }).format(new Date(todo.startDate))}
      </p>

      {/* 日付範囲の表示 or 編集用のDatePicker */}
      {editingId === todo.id ? (
        <DatePicker
          selectsRange
          startDate={editDate[0]}
          endDate={editDate[1]}
          onChange={(update) => setEditDate(update)}
          locale={ja}
          dateFormat="yyyy年MM月dd日（eee）"
          customInput={<CustomInput />}
        />
      ) : (
        <p className={todo.status ? "done" : ""}>
          予定日 :{" "}
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

      {/* 操作ボタン群 */}
      <div>
        {/* 完了/未完了トグル */}
        <button
          className={`todo-Btn ${editingId === todo.id ? "hide" : ""}`}
          onClick={() => handleState(todo.id)}
        >
          {todo.status === false ? "完了" : "未完了"}
        </button>

        {/* 編集中なら「保存」、通常時は「修正」 */}
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
              handleModify(todo.id, todo.content, todo.startDate, todo.endDate)
            }
          >
            修正
          </button>
        )}

        {/* 削除ボタン（編集中は非表示） */}
        <button
          className={`todo-Btn del ${editingId === todo.id ? "hide" : ""}`}
          onClick={() => handleDelete(todo.id)}
        >
          削除
        </button>
      </div>
    </li>
  );
}
