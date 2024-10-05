import { Component, OnInit, ViewChild, OnDestroy, Inject, PLATFORM_ID, Input } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from "../post-card/post-card.component";
import { CreatePostComponent } from "../create-post/create-post.component";
import { UserProfileComponent } from "../../views/auth/user-profile/user-profile.component";
import { Subscription } from 'rxjs';
import { FireblogFacadeService } from '../../services/fireblog/fireblog-facade.service';
import { IBlog } from '../../services/blog.interface';
import { CommentsComponent } from "../comments/comments.component";
import { AnalyticsService } from '../../services/analytics/fireblog-analytics.service';
import { SafeHtml } from '@angular/platform-browser';
import { SeoService } from '../../services/seo/fireblog-seo.service';
import { ProfileAvatarComponent } from "../profile-avatar/profile-avatar.component";
import { ToggleService } from '../../services/toggle/toggle.service';


@Component({
  selector: 'app-fireblog-page',
  templateUrl: './fireblog-page.component.html',
  styleUrls: ['./fireblog-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    PostCardComponent,
    CreatePostComponent,
    UserProfileComponent,
    CommentsComponent,
    ProfileAvatarComponent
]
})
export class FireblogPageComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSidebarOpen: boolean = false;
  isCreatePostOpen = false;

  blogPosts: IBlog[] = [];
  expandedPostId: string | null = null;
  @Input() blogPost!: IBlog;
  structuredData!: SafeHtml;
  private sidebarSubscription: Subscription | undefined;
  private blogPostsSubscription: Subscription | undefined;
  private createPostSubscription!: Subscription;

  constructor(
    private blogFacade: FireblogFacadeService,
    private analyticsService: AnalyticsService,
    private seoService: SeoService,
    private toggle: ToggleService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getBlogPosts();
    this.sidebarSubscription = this.toggle.sidebarOpen$.subscribe((isOpen: boolean) => {
      this.isSidebarOpen = isOpen;
      if (this.sidenav) {
        isOpen ? this.sidenav.open() : this.sidenav.close();
      }
    });
    this.createPostSubscription = this.toggle.createPostOpen$.subscribe(
      isOpen => this.isCreatePostOpen = isOpen
    );
  }



  onToggleComments(postId: string) {
    this.expandedPostId = this.expandedPostId === postId ? null : postId;
    const isExpanded = this.expandedPostId === postId;
    this.analyticsService.logCommentToggle(postId, isExpanded);
  }

  trackPostView(post: IBlog) {
    if (post.id && post.content) {
      this.analyticsService.logPostView(post.id, post.content);
    } else {
      console.warn('Attempted to track post view with undefined id or title', post);
    }
  }

  ngOnDestroy(): void {
    if (this.blogPostsSubscription) {
      this.blogPostsSubscription.unsubscribe();
    }
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
    this.createPostSubscription.unsubscribe();
  }

  toggleCreatePost() {
    this.toggle.toggleCreatePost();
  }

  getBlogPosts(): void {
    this.blogPostsSubscription = this.blogFacade.getBlogPosts().subscribe(
      (posts: IBlog[]) => {
        this.blogPosts = posts;
        this.updateSeoTags();
      },
      (error: any) => {
        console.error('Error fetching blog posts:', error);
      }
    );
  }

  updateSeoTags() {
    this.seoService.setTitle('FireBlog - Latest Posts');
    this.seoService.setMetaTags([
      { name: 'description', content: 'Read the latest blog posts on FireBlog' },
      { name: 'keywords', content: 'blog, posts, fireblog, angular' }
    ]);
    this.seoService.setCanonicalLink('/blog');
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggle.toggleSidebar();
  }

  toggleCreatPost(){
    this.toggle.toggleCreatePost()
  }
}
