import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authListener : Subscription;
  isAuthenticated : boolean = false;
  userName : string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.getisAuthenticatedStatus();
    this.userName = this.authService.getUserName();

    this.authListener = this.authService.getAuthStatusListener()
                        .subscribe(authenticationStatus => {
                            this.isAuthenticated = authenticationStatus;
                            this.userName = this.authService.getUserName();
                        });
  }

  ngOnDestroy(){
    this.authListener.unsubscribe();
  }

  onLogout(){
      this.authService.logout();
  }

}
