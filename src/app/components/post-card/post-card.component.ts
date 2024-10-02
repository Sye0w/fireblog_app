import { Component } from '@angular/core';
import { LikesComponent } from "../likes/likes/likes.component";

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [LikesComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {

}
