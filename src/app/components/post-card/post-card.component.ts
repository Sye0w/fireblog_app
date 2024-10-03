import { Component, Input } from '@angular/core';
import { LikesComponent } from "../likes/likes/likes.component";
import { CommonModule } from '@angular/common';
import { IBlog } from '../../services/blog.interface';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [LikesComponent, CommonModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
  @Input() blogPost!: IBlog;

  getTimeSince(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  }
}
