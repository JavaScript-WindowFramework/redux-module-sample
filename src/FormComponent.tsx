import React from "react";
import { useModule } from "@jswf/redux-module";
import { JSWindow, WindowState } from "@jswf/react";
import { TodoModule } from "./TodoModule";
/**
 *入力フォームコンポーネント
 *
 * @returns
 */
export function FormComponent() {
  const todoModule = useModule(TodoModule);
  const id = todoModule.getState("input", "id");
  return (
    <JSWindow
      title={`ToDo設定(${id === 0 ? "新規" : id})`}
      windowState={todoModule.getState("window")!}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <div>タイトル</div>
          <input
            style={{ width: "20em" }}
            value={todoModule.getState("input", "title")!}
            onChange={e =>
              todoModule.setState(e.target.value, "input", "title")
            }
          />
          <div>説明</div>
          <textarea
            style={{ width: "20em", height: "5em" }}
            value={todoModule.getState("input", "desc")!}
            onChange={e => todoModule.setState(e.target.value, "input", "desc")}
          />
          <div>
            <button
              onClick={() => {
                todoModule.setState({ window: WindowState.HIDE });
                todoModule.addTodo();
              }}
            >
              Todoを作成
            </button>
          </div>
        </div>
      </div>
    </JSWindow>
  );
}
