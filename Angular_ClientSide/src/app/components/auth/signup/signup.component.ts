import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  isLoading : boolean = false;
  signupForm: FormGroup;


  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  onLogin(signupForm){

    if(signupForm.invalid){
      return;
    }

    this.authService.createUser(this.signupForm.value.name,this.signupForm.value.email,this.signupForm.value.password);

  }

}
