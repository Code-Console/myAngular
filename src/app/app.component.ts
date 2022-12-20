import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IState, PageView } from './Interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  pageView = PageView;
  state$!: Observable<IState>;
  title = 'myAngular';
  onUpdate(str:string){
    console.log('onUpdate ~Parent~',str);
  }
  constructor(store: Store<{ state: IState }>) {
    this.state$ = store.pipe(select("state"));
  }
}
