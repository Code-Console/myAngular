import { Component } from '@angular/core';
import { faFacebook,faGithub,faSkype } from '@fortawesome/free-brands-svg-icons';

  
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {
  faFacebookF = faFacebook;
  faGit = faGithub;
  faSkype=faSkype;
}
