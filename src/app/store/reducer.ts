import { Action, createReducer, on } from "@ngrx/store";
import { IState, PageView } from "../Interface";
import { increment, decrement, reset, actionSetPage } from "./action";

const initialState: IState = { count: 0, page: PageView.PORTFOLIO };
const _counterReducer = createReducer(
  initialState,
  on(increment, (state) => ({ ...state, count: state.count + 1 })),
  on(decrement, (state) => ({ ...state, count: state.count - 1 })),
  on(reset, (state) => ({ ...state, count: 0 }))
);

export const counterReducer = (_state: any, action: any) => {
  const state: IState = _state || initialState;
  switch (action.type) {
    case increment.type:
      return { ...state, count: state.count + 1 };
    case decrement.type:
      return { ...state, count: state.count - 1 };
    case reset.type:
      return { ...state, count: 0 };
    case actionSetPage.type:
      console.log(action.payload);
      return { ...state, page: action.payload };
  }
  return state;
};
