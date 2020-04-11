import { Component, OnInit } from '@angular/core';
import { Post } from './components/posts/data-type/post.model';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'meanDev';

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.autoAuthUser();
  }

}
