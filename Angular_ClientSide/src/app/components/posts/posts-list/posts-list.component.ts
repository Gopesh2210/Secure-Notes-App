import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../data-type/post.model';
import { PostDataService } from 'src/app/services/post-data/post-data.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit,OnDestroy {


  posts: Post[] = [];
  private postsSubscription: Subscription;
  isLoading: boolean = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  authListener : Subscription;
  isAuthenticated : boolean = false;
  userId : string;


  constructor(private postDataService: PostDataService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    console.log("USER ID:",this.userId);

    // the IF checks whether or not the user is authenticated before routing to home page
    if(this.userId){
      this.postDataService.getPosts(this.postsPerPage,this.currentPage);
      this.postsSubscription = this.postDataService.getPostsUpdateListener()
      .subscribe((postData: {post : Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.post;
        this.totalPosts = postData.postCount;
      });
  
      this.isAuthenticated = this.authService.getisAuthenticatedStatus();
      this.authListener =  this.authService.getAuthStatusListener()
                          .subscribe(authenticationStatus => {
                              this.isAuthenticated = authenticationStatus;
                              this.userId = this.authService.getUserId();
                          });
    }
    else{
       this.isLoading = false;
    }

  
  }

  ngOnDestroy(){
    if(this.userId){
      this.postsSubscription.unsubscribe();
      this.authListener.unsubscribe();
    }
  }

  onDelete(postId){
    this.postDataService.deletePost(postId).subscribe(() => {
      this.postDataService.getPosts(this.postsPerPage,this.currentPage);  
    }, () =>{
      this.isLoading = false;
    });
  }
  onChangedPage(pageData: PageEvent){
    // this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postDataService.getPosts(this.postsPerPage,this.currentPage);
  }


}
