import { Component, OnInit } from '@angular/core';
import { Post } from '../data-type/post.model';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { PostDataService } from '../../../services/post-data/post-data.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../../../validator/mime-type-validator/mime-type.validator';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {


  createPostForm: FormGroup;
  private mode = 'create';
  private postId;
  editablePost: Post;
  isLoading : boolean = false;
  imagePreview : any;

  constructor(private fb: FormBuilder, private postDataService: PostDataService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.createForm();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // handling loader
        this.isLoading = true;
        // fetching the editable data from the backend
        this.postDataService.getEditablePost(this.postId).subscribe((editableData)=>
         {
           // handling loader
           this.isLoading = false;
           // setting editable data to the local variable
           this.editablePost = {id: editableData._id, title: editableData.title, content: editableData.content, imagePath: editableData.imagePath };
           // patching the value to the form for editing
           this.createPostForm.patchValue({title:this.editablePost.title,content:this.editablePost.content, image:this.editablePost.imagePath});
         });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  createForm() {
    this.createPostForm = this.fb.group({
      title: [null, Validators.required],
      content: [null, [Validators.required, Validators.minLength(4)]],
      image: new FormControl(null,{ validators: [Validators.required] ,asyncValidators: [mimeType]})
    });
  }

  savePost() {

    this.isLoading = true;

    if(this.mode === 'create'){
      this.postDataService.addPosts(this.createPostForm.value.title, this.createPostForm.value.content, this.createPostForm.value.image);
      // alert('Note added!');
    } else if(this.mode === 'edit'){
      this.postDataService.updatePost(this.postId,this.createPostForm.value.title, this.createPostForm.value.content, this.createPostForm.value.image);
      // alert('Note updated!');
    }
    this.createPostForm.reset();
  }

  onImageUpload(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.createPostForm.patchValue({image: file});
    this.createPostForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
    

  }

}
