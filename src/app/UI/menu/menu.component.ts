import { Component } from "@angular/core";
import { AnimType } from "src/app/Interface";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.sass"],
})
export class MenuComponent {
  menuItems = Object.values(AnimType);
  show = false;
  onMenuClick() {
    this.show = !this.show;
    console.log("onMenuClick ~~~", this.show);
  }
  onItemClick(item:AnimType){
    console.log("item ~~~", item);
  }
}
