import { Component } from '@angular/core';
import { faDev,faGithub,faSkype,faLinkedin } from '@fortawesome/free-brands-svg-icons';

  
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {
  faFacebookF = faDev;
  faGit = faGithub;
  faSkype=faSkype;
  faLinkedin = faLinkedin;
}
