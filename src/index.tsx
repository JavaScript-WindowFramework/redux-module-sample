import React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { ModuleReducer } from "@jswf/redux-module";
import { FormComponent } from "./FormComponent";
import { TodoListComponent } from "./TodoListComponent";

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
