import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from '../create-post/create-post.component';
import { PostsListComponent } from '../posts-list/posts-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'src/app/shared/shared-material/shared-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [ CreatePostComponent, PostsListComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AppRoutingModule
  ]
})
export class PostsModule { }
