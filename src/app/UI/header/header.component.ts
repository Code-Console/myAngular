import { Component } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { basePath, logoImg } from "src/app/assets";
import { IState, PageView } from "src/app/Interface";
import {
  increment,
  decrement,
  reset,
  actionSetPage,
} from "src/app/store/action";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.sass"],
})
export class HeaderComponent {
  baseURL = basePath;
  logoURL = logoImg;
  pageView = PageView;
  state$!: Observable<IState>;
  increment() {
    this.store.dispatch(increment());
  }
  decrement() {
    this.store.dispatch(decrement());
  }
  reset() {
    this.store.dispatch(reset());
  }
  actionSetPage(page: PageView) {
    this.store.dispatch(actionSetPage({ payload: page }));
  }

  constructor(private store: Store<{ state: IState }>) {
    this.state$ = store.pipe(select("state"));
  }
}
