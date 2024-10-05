import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { FireblogFacadeService } from '../../../services/fireblog/fireblog-facade.service';
// import { FireblogFacadeService } from '../../../services/fireblog-facade.service';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [MatBadgeModule, CommonModule],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.scss'
})
export class LikesComponent {
  @Input() likesCount!: string;
  @Input() blogPostId!: string;
  @Output() likesUpdated = new EventEmitter<string>();

  constructor(private blogFacade: FireblogFacadeService) {}

  async addLike() {
    await this.blogFacade.addLike(this.blogPostId);
    this.likesCount = (parseInt(this.likesCount) + 1).toString();
    this.likesUpdated.emit(this.likesCount);
  }

  async removeLike() {
    if (parseInt(this.likesCount) > 0) {
      await this.blogFacade.removeLike(this.blogPostId);
      this.likesCount = (parseInt(this.likesCount) - 1).toString();
      this.likesUpdated.emit(this.likesCount);
    }
  }
}
