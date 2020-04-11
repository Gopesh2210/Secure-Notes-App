import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  isLoading : boolean = false;
  loginForm: FormGroup;
  private authListener : Subscription;


  constructor(private fb: FormBuilder,private authService : AuthService) { }

  ngOnInit() {
    
    this.createForm();
    this.authListener =  this.authService.getAuthStatusListener()
                        .subscribe(authenticationStatus => {
                            this.isLoading = false;
                        });
  }

  ngOnDestroy(){

    this.authListener.unsubscribe();
    
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  onLogin(loginForm){

    if(loginForm.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.userLogin(this.loginForm.value.email,this.loginForm.value.password);
  }

}
