import { createReducer, on } from "@ngrx/store";
import { increment, decrement, reset } from "./action";

const initialState = 0;
const _counterReducer = createReducer(
  initialState,
  on(increment, (state) => state + 1),
  on(decrement, (state) => state - 1),
  on(reset, (state) => 0)
);

export const counterReducer = (state: any, _action: any) => {
  return _counterReducer(state, _action);
};
