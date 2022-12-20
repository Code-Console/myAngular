import { Component } from "@angular/core";
import { androidImg, gamesImg, nodeImg, threeImg } from "src/app/assets";

@Component({
  selector: "app-portfolio",
  templateUrl: "./portfolio.component.html",
  styleUrls: ["./portfolio.component.sass"],
})
export class PortfolioComponent {
  androidURL = androidImg;
  threeURL = threeImg;
  nodeURL = nodeImg;
  gamesURL = gamesImg;
}
