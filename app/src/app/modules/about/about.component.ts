import { Component} from '@angular/core';
import { Router }            from '@angular/router';

@Component({
  selector: 'about',
  templateUrl: 'about.component.html'
})
export class AboutComponent {

  constructor(private router: Router) {
  }
}
