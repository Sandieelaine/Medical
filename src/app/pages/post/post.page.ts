import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  selectedPost;

  constructor(private api: AuthenticationService) { }

  ngOnInit() {
    this.selectedPost = this.api.selectedNewsPost;
    console.log(this.selectedPost);
  }

}
