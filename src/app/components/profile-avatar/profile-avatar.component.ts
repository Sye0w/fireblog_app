import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FireblogFacadeService } from '../../services/fireblog/fireblog-facade.service';
import { Subscription } from 'rxjs';
import { IUser } from '../../services/blog.interface';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-profile-avatar',
  standalone: true,
  imports: [],
  templateUrl: './profile-avatar.component.html',
  styleUrl: './profile-avatar.component.scss',
})

export class ProfileAvatarComponent implements OnInit, OnDestroy {
  @Input() set isSidebarOpen(value: boolean) {
    this._isSidebarOpen = value;
    this.visibilityState = value ? 'hidden' : 'visible';
  }
  get isSidebarOpen(): boolean {
    return this._isSidebarOpen;
  }

  @Output() toggleSidebar = new EventEmitter<void>();
  currentUser: IUser | null = null;
  private userSubscription: Subscription | undefined;
  visibilityState: 'visible' | 'hidden' = 'visible';
  private _isSidebarOpen = false;

  constructor(
    private blogFacade: FireblogFacadeService,
  ) {}

  ngOnInit() {
    this.userSubscription = this.blogFacade.getCurrentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebarEvent() {
    this.toggleSidebar.emit();
  }
}
