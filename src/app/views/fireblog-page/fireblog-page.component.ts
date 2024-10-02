import { Component } from '@angular/core';
import { LikesComponent } from '../../components/likes/likes/likes.component';
import { PostCardComponent } from "../../components/post-card/post-card.component";
import { CreatePostComponent } from "../../components/create-post/create-post.component";


@Component({
  selector: 'app-fireblog-page',
  standalone: true,
  imports: [LikesComponent, PostCardComponent, CreatePostComponent],
  templateUrl: './fireblog-page.component.html',
  styleUrl: './fireblog-page.component.scss'
})
export class FireblogPageComponent {

}
