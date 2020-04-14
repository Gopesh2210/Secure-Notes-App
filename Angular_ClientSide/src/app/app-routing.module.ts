import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsListComponent } from './components/posts/posts-list/posts-list.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';


const routes: Routes = [
  { path:'', component: PostsListComponent },
  { path:'create', component: CreatePostComponent , canActivate: [AuthGuardService] },
  { path:'edit/:postId', component: CreatePostComponent , canActivate: [AuthGuardService] },
  { path:'auth', loadChildren: () =>
   import('./components/auth/auth-routing-module/auth-routing.module').then(m => m.AuthRoutingModule) }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
