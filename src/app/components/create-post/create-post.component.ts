import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FireblogFacadeService } from '../../services/fireblog/fireblog-facade.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IUser } from '../../services/blog.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileAvatarComponent } from "../profile-avatar/profile-avatar.component";
import { ToggleService } from '../../services/toggle/toggle.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, ProfileAvatarComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})

export class CreatePostComponent implements OnInit, OnDestroy {
  currentUser: IUser | null = null;
  private userSubscription: Subscription | undefined;
  private createPostSubscription!: Subscription;
  content = '';
  isSidebarOpen = false;
  isCreateOpen: boolean = false;


  constructor(private blogFacade: FireblogFacadeService,
    private toggle: ToggleService
  ) {}

  ngOnInit() {
    this.userSubscription = this.blogFacade.getCurrentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.createPostSubscription = this.toggle.createPostOpen$.subscribe(
      (isOpen:boolean) => this.isCreateOpen = isOpen
    );
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.createPostSubscription.unsubscribe();
  }

  createPost() {
    if (this.currentUser && this.content.trim()) {
      this.blogFacade.createBlogPost(this.currentUser, this.content)
        .then(() => {
          console.log('Post created successfully');
          this.content = '';
        })
        .catch(error => {
          console.error('Error creating post:', error);
        });
    } else {
      console.error('Cannot create post: User not logged in or content is empty');
    }
  }

  toggleCreatePost() {
    this.toggle.toggleCreatePost();
  }

}
