import React, { Component } from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {
  ModuleReducer,
  useModule,
  ReduxModule,
  mapModule,
  mapConnect
} from "@jswf/redux-module";

/**
 *データ構造の定義(TypeScript使用時)
 *
 * @export
 * @interface TestState
 */
export interface TestState {
  msg: string;
}
/**
 *Storeアクセス用クラス
 *(クラスごとに自動的にStoreに領域を確保する)
 * @export
 * @class TestModule
 * @extends {ReduxModule<TestState>}
 */
export class TestModule extends ReduxModule<TestState> {
  //ここに初期値を設定可能
  protected static defaultState: TestState = {
    msg: "初期値"
  };
  //以下のようなアクセス用のメソッドは、必ずしも作る必要は無い
  //getStateとsetStateはpublicなので、外から直接書き換えてしまってもOK
  public getMessage() {
    return this.getState("msg")!;
  }
  public setMessage(msg: string) {
    this.setState({ msg });
  }
}
/*
export class OtherModule extends ReduxModule {
  static includes = [TestModule]
  public getMessage() {
    return this.getModule(TestModule).getState("msg")!;
  }
  public setMessage(msg: string) {
    this.getModule(TestModule).setState({ msg });
  }
}
*/
/**
 *Hooks用サンプル
 *
 * @returns
 */
function HooksApp() {
  //モジュールのインスタンスを受け取る
  //useModuleの使用可能場所の制限は他のhookと同じ
  const testModule = useModule(TestModule);
  //以下のようにPrefixを付けると、同じクラスが違う領域を持つことも出来る
  //const testModule = useModule(TestModule,"Prefix");
  return (
    <>
      <div>FunctionComponent</div>
      <input
        value={testModule.getMessage()}
        onChange={e => testModule.setMessage(e.target.value)}
      />
      <hr />
    </>
  );
}

/**
 *Class用サンプル
 *
 * @class _ClassApp
 * @extends {Component}
 */
class _ClassApp extends Component {
  render() {
    //モジュールのインスタンスを受け取る
    //Hooksと名前と引数が微妙に違うので注意
    const testModule = mapModule(this.props, TestModule);
    return (
      <>
        <div>ClassComponent</div>
        <input
          value={testModule.getMessage()}
          onChange={e => testModule.setMessage(e.target.value)}
        />
        <hr />
      </>
    );
  }
}
//クラスコンポーネントを利用する場合は以下の方法でマッピングする
//ここで宣言したモジュール以外はクラスで使用できない
//モジュールは配列で複数指定も可能
const ClassApp = mapConnect(_ClassApp, TestModule);

//Reduxに専用のReducerを関連付ける
//他のReducerと併用することも可能
const store = createStore(ModuleReducer);
ReactDOM.render(
  <Provider store={store}>
    <HooksApp />
    <ClassApp />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
