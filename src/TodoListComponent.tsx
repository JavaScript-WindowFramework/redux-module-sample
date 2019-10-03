import React from "react";
import { useModule } from "@jswf/redux-module";
import { WindowState } from "@jswf/react";
import { TodoModule } from "./TodoModule";
/**
 *ToDo出力コンポーネント
 *
 * @returns
 */
export function TodoListComponent() {
  const todoModule = useModule(TodoModule);
  const todos = todoModule.getState("todos")!;
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        onClick={() =>
          todoModule.setState({
            window: WindowState.NORMAL,
            input: { id: 0, title: "", desc: "" }
          })
        }
      >
        新規作成
      </button>
      {todos.map(todo => (
        <div
          key={todo.id}
          style={{
            display: "inline-block",
            width: "20em",
            marginTop: "1em",
            border: "solid 1px",
            textAlign: "center"
          }}
          onClick={() =>
            todoModule.setState({
              window: WindowState.NORMAL,
              input: { ...todo }
            })
          }
        >
          <div>
            {todo.id}:{todo.title}{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={e => {
                e.stopPropagation();
                todoModule.updateDone(todo.id, !todo.done);
              }}
            >
              {todo.done ? "完了" : "未完了"}
            </span>
            {todo.done && (
              <span
                style={{ cursor: "pointer" }}
                onClick={e => {
                  e.stopPropagation();
                  todoModule.remove(todo.id);
                }}
              >
                削除
              </span>
            )}
          </div>
          <div>{todo.desc}</div>
        </div>
      ))}
    </div>
  );
}
