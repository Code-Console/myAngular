import { createAction, props } from "@ngrx/store";
import { PageView } from "../Interface";

export const increment = createAction("increment");
export const decrement = createAction("decrement");
export const reset = createAction("reset");

export const actionSetPage = createAction(
  "actionSetPage",
  props<{ payload: PageView }>()
);
