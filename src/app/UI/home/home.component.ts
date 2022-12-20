import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  faDev,
  faGithub,
  faSkype,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { PageView } from "src/app/Interface";

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
  @Output() onUpdate:EventEmitter<string> = new EventEmitter();
  pageView = PageView;
  onSubmit(){
    this.onUpdate.emit("New"+Math.random());
  }
  constructor() {
    console.log("bankName!!! ", this.page);
  }
}
