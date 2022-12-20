import { createReducer, on } from "@ngrx/store";
import { IState } from "../Interface";
import { increment, decrement, reset } from "./action";

const initialState: IState = { count: 0, page: "yogesh" };
const _counterReducer = createReducer(
  initialState,
  on(increment, (state) => ({ ...state, count: state.count + 1 })),
  on(decrement, (state) => ({ ...state, count: state.count - 1 })),
  on(reset, (state) => ({ ...state, count: 0 }))
);

export const counterReducer = (state: any, _action: any) => {
  return _counterReducer(state, _action);
};
