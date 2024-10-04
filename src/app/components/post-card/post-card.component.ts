import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LikesComponent } from "../likes/likes/likes.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { IBlog, IUser } from '../../services/blog.interface';
import { FireblogFacadeService } from '../../services/fireblog/fireblog-facade.service';
import { CommentsComponent } from "../comments/comments.component";
import { PrependAtPipe } from '../../pipe/prepend-at.pipe';
import { SeoService } from '../../services/seo/fireblog-seo.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    LikesComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    CommentsComponent,
    PrependAtPipe
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
  @Input() blogPost!: IBlog;
  @Output() commentToggled = new EventEmitter<string>();

  randomAvatarUrl: string = '';
  currentUser: IUser | null = null;
  isEditing: boolean = false;
  editedContent: string = '';

  constructor(private fireblogFacade: FireblogFacadeService,
    private seoService: SeoService) {}

  ngOnInit() {
    this.generateRandomAvatarUrl();
    this.fireblogFacade.getCurrentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.generateStructuredData();
  }

  generateStructuredData() {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': this.blogPost.content,
      'datePublished': this.blogPost.createdAt,
      'author': {
        '@type': 'Person',
        'name': this.blogPost.user.username
      },
      'description': this.blogPost.content.substring(0, 200) + '...'
    };

    this.seoService.setStructuredData(data);
  }

  generateRandomAvatarUrl() {
    const seed = Math.random().toString(36).substring(7);
    this.randomAvatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`;
  }

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

  isCurrentUserPost(): boolean {
    return this.currentUser?.uid === this.blogPost.user.uid;
  }

  onEdit() {
    this.isEditing = true;
    this.editedContent = this.blogPost.content;
  }

  onSave() {
    if (this.blogPost.id) {
      this.fireblogFacade.updateBlogPost(this.blogPost.id, { content: this.editedContent })
        .then(() => {
          this.blogPost.content = this.editedContent;
          this.isEditing = false;
        })
        .catch(error => console.error('Error updating post:', error));
    }
  }

  onCancel() {
    this.isEditing = false;
    this.editedContent = '';
  }

  onDelete() {
    if (this.blogPost.id) {
      this.fireblogFacade.deleteBlogPost(this.blogPost.id)
        .then(() => {
          // You might want to emit an event here to notify the parent component
          // that this post has been deleted and should be removed from the list
        })
        .catch(error => console.error('Error deleting post:', error));
    }
  }


  toggleComments() {
    if (this.blogPost.id) {
      this.commentToggled.emit(this.blogPost.id);
    }
  }
}
