import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading : boolean = false;
  signupForm: FormGroup;
  private authListener : Subscription;


  constructor(private fb: FormBuilder, private authService: AuthService) { }

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
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  onSignup(signupForm){

    if(signupForm.invalid){
      return;
    }
    
    this.isLoading = true;
    this.authService.createUser(this.signupForm.value.name,this.signupForm.value.email,this.signupForm.value.password);

  }

}
