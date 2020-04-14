import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { SharedMaterialModule } from 'src/app/shared/shared-material/shared-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from '../auth-routing-module/auth-routing.module';



@NgModule({
  declarations: [ LoginComponent, SignupComponent ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
