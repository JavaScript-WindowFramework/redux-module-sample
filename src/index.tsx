import React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {
  ModuleReducer,
  useModule,
  ReduxModule
} from "@jswf/redux-module";

/**
 *データ構造の定義(TypeScript使用時)
 *
 * @export
 * @interface TodoState
 */
interface TodoState {
  //入力中データの保持
  input: {
    title: string;
    desc: string;
  };
  //TODOリスト
  todos: {
    id: number;
    title: string;
    desc: string;
    done: boolean;
  }[];
  //TODOのID附番表index
  index: number;
}

/**
 *Todoデータ管理用クラス
 *
 * @export
 * @class TodoModule
 * @extends {ReduxModule<TestState>}
 */
export class TodoModule extends ReduxModule<TodoState> {
  //初期値
  protected static defaultState: TodoState = {
    todos: [],
    input: { title: "", desc: "" },
    index: 0
  };
  /**
   *ToDoリストを返す
   *
   * @returns
   * @memberof TodoModule
   */
  public getTodos() {
    return this.getState("todos")!;
  }
  /**
   *ToDoを追加(追加データはStoreに入っているので引数不要)
   *
   * @memberof TodoModule
   */
  public addTodo() {
    //indexのインクリメント
    const index = this.getState("index")! + 1;
    this.setState({ index });
    //必要データの読み出し
    const title = this.getState("input", "title")!;
    const desc = this.getState("input", "desc")!;
    //todoを追加
    const todos = [
      ...this.getState("todos")!,
      { id: index, title, desc, done: false }
    ];
    this.setState({ todos })!;
  }
  /**
   *ToDoの状態管理
   *
   * @param {number} id
   * @param {boolean} done
   * @memberof TodoModule
   */
  public updateDone(id: number, done: boolean) {
    const srcTodos = this.getState("todos")!;
    //状態の書き換え
    const todos = srcTodos.map(todo =>
      todo.id === id ? { ...todo, done } : todo
    );
    this.setState({ todos });
  }
  /**
   *ToDoの削除
   *
   * @param {number} id
   * @memberof TodoModule
   */
  public remove(id: number) {
    const srcTodos = this.getState("todos")!;
    //削除データを除外
    const todos = srcTodos.filter(todo => todo.id !== id);
    this.setState({ todos });
  }
}


/**
 *入力フォームコンポーネント
 *
 * @returns
 */
function FormComponent() {
  const todoModule = useModule(TodoModule);
  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <div>タイトル</div>
        <input
          style={{ width: "20em" }}
          value={todoModule.getState("input", "title")!}
          onChange={e => todoModule.setState(e.target.value, "input", "title")}
        />
        <div>説明</div>
        <textarea
          style={{ width: "20em", height: "5em" }}
          value={todoModule.getState("input", "desc")!}
          onChange={e => todoModule.setState(e.target.value, "input", "desc")}
        />
        <div>
          <button onClick={() => todoModule.addTodo()}>Todoを作成</button>
        </div>
      </div>
    </div>
  );
}

/**
 *ToDo出力コンポーネント
 *
 * @returns
 */
function TodoListComponent() {
  const todoModule = useModule(TodoModule);
  const todos = todoModule.getState("todos")!;
  return (
    <div style={{ display:"flex",flexDirection: "column" ,alignItems:"center"}}>
      {todos.map(todo => (
        <div
          key={todo.id}
          style={{
            display: "inline-block",
            width: "20em",
            marginTop: "1em",
            border: "solid 1px",
            textAlign:"center"
          }}
        >
          <div>
            {todo.id}:{todo.title}{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => todoModule.updateDone(todo.id, !todo.done)}
            >
              {todo.done ? "完了" : "未完了"}
            </span>
            {todo.done && (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => todoModule.remove(todo.id)}
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

//Reduxに専用のReducerを関連付ける
//他のReducerと併用することも可能
const store = createStore(ModuleReducer);
ReactDOM.render(
  <Provider store={store}>
    <FormComponent />
    <TodoListComponent />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
