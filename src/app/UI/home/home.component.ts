import { Component, EventEmitter, Input, Output } from "@angular/core";
import {  Store } from "@ngrx/store";
import {
  faDev,
  faGithub,
  faSkype,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { IState, PageView } from "src/app/Interface";
import { actionSetPage } from "src/app/store/action";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"],
})
export class HomeComponent {
  
  faFacebookF = faDev;
  faGit = faGithub;
  faSkype = faSkype;
  faLinkedin = faLinkedin;
  @Input() page: PageView | undefined;
  @Output() onChildUpdate: EventEmitter<string> = new EventEmitter();
  pageView = PageView;
  onSubmit() {
    this.onChildUpdate.emit("New" + Math.random());
  }
  actionSetPage(page: PageView) {
    this.store.dispatch(actionSetPage({ payload: page }));
  }

  constructor(private store: Store<{ state: IState }>) {
    
  }
}
