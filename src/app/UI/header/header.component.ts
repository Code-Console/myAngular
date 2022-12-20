import { Component } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { IState } from "src/app/Interface";
import { increment, decrement, reset } from "src/app/store/action";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.sass"],
})
export class HeaderComponent {
  count = 0;
  count$!: Observable<IState>;
  increment() {
    this.store.dispatch(increment());
  }
  decrement() {
    this.store.dispatch(decrement());
  }
  reset() {
    this.store.dispatch(reset());
  }

  constructor(private store: Store<{ count: IState }>) {
    this.count$ = store.pipe(select("count"));
  }
}
