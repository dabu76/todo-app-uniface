export default function FilterButtons({ onFilterChange }) {
  return (
    <div className="filter-buttons">
      <button className="todo-Btn" onClick={() => onFilterChange("today")}>
        ToDo
      </button>
      <button className="todo-Btn" onClick={() => onFilterChange("all")}>
        全件
      </button>
      <button className="todo-Btn" onClick={() => onFilterChange("undone")}>
        未完了のみ
      </button>
      <button className="todo-Btn" onClick={() => onFilterChange("done")}>
        完了のみ
      </button>
    </div>
  );
}
