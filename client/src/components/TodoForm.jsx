import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale";
import { forwardRef } from "react";
import "react-datepicker/dist/react-datepicker.css"; // ✅ 필수

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

export default function TodoForm({
  content,
  setContent,
  selectedDate,
  setSelectedDate,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        placeholder="内容（全角100文字以内）"
        maxLength={100}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <DatePicker
        selectsRange
        startDate={selectedDate[0]}
        endDate={selectedDate[1]}
        onChange={(update) => setSelectedDate(update)}
        locale={ja}
        dateFormat="yyyy年MM月dd日（eee）"
        customInput={<CustomInput />}
      />
      <button type="submit">登録</button>
    </form>
  );
}
