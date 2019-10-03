import { ReduxModule } from "@jswf/redux-module";
import { WindowState } from "@jswf/react";
/**
 *データ構造の定義(TypeScript使用時)
 *
 * @export
 * @interface TodoState
 */
interface TodoState {
  //TODOリスト
  todos: {
    id: number;
    title: string;
    desc: string;
    done: boolean;
  }[];
  //TODOのID附番用index
  index: number;
  //入力中データの保持
  input: {
    id: number;
    title: string;
    desc: string;
  };
  //Windowの状態
  window: WindowState;
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
    todos: [
      { id: 1, title: "Sample01", desc: "最初のサンプル", done: true },
      { id: 2, title: "Sample02", desc: "二番目のサンプル", done: false }
    ],
    input: { id: 0, title: "", desc: "" },
    index: 0,
    window: WindowState.HIDE
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
    //必要データの読み出し
    const { id, title, desc } = this.getState("input")!;
    let todos;
    //IDが0なら追加、それ以外なら内容を書き換える
    if (id === 0) {
      //indexのインクリメント
      const index = this.getState("index")! + 1;
      this.setState({ index });
      //todoを追加
      todos = [
        ...this.getState("todos")!,
        { id: index, title, desc, done: false }
      ];
    }
    else {
      const srcTodos = this.getState("todos")!;
      //内容の書き換え
      todos = srcTodos.map(todo => todo.id === id ? { ...todo, title, desc } : todo);
    }
    this.setState({ todos })!;
    this.setState({ id: 0, title: "", desc: "" } as const, "input");
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
    const todos = srcTodos.map(todo => todo.id === id ? { ...todo, done } : todo);
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
