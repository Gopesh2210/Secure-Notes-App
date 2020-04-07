import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../data-type/post.model';
import { PostDataService } from 'src/app/services/post-data/post-data.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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

  constructor(private postDataService: PostDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postDataService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSubscription = this.postDataService.getPostsUpdateListener()
    .subscribe((postData: {post : Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.post;
      this.totalPosts = postData.postCount;
    });
  }

  ngOnDestroy(){
    this.postsSubscription.unsubscribe();
  }

  onDelete(postId){
    this.postDataService.deletePost(postId).subscribe(() => {
      this.postDataService.getPosts(this.postsPerPage,this.currentPage);  
    });
  }
  onChangedPage(pageData: PageEvent){
    // this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postDataService.getPosts(this.postsPerPage,this.currentPage);
  }


}
