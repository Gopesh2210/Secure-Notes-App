import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsListComponent } from './components/posts/posts-list/posts-list.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';


const routes: Routes = [
  { path:'', component: PostsListComponent , canActivate: [AuthGuardService] },
  { path:'create', component: CreatePostComponent , canActivate: [AuthGuardService] },
  { path:'edit/:postId', component: CreatePostComponent , canActivate: [AuthGuardService] },
  { path: 'login',  component:  LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
