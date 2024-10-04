import { Component, Input } from '@angular/core';
import { FireblogFacadeService } from '../../services/fireblog/fireblog-facade.service';
import { IComment } from '../../services/blog.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { PrependAtPipe } from '../../pipe/prepend-at.pipe';
@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    PrependAtPipe
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})

export class CommentsComponent {
  @Input() postId!: string | undefined;
  @Input() comments: IComment[] = [];
  newCommentContent: string = '';

  constructor(private fireblogFacade: FireblogFacadeService) {}

  addComment() {
    if (this.newCommentContent.trim()) {
      this.fireblogFacade.getCurrentUser$.subscribe(user => {
        if (user && this.postId) {  // Ensure postId is defined
          const newComment: IComment = {
            content: this.newCommentContent,
            createdAt: new Date().toISOString(),
            user: {
              uid: user.uid,
              username: user.username,
              image: user.image,
              email: '',
              password: ''
            },
            likes: ''
          };
          this.fireblogFacade.addCommentToBlogPost(this.postId, newComment)
            .then(() => {
              this.comments.push(newComment);
              this.newCommentContent = '';
            })
            .catch(error => console.error('Error adding comment:', error));
        } else {
          console.error('Post ID is undefined or invalid.');
        }
      });
    }
  }


}
