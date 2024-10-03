import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { IBlog } from '../../../services/blog.interface';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [MatBadgeModule,CommonModule],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.scss'
})

export class LikesComponent {
  @Input() likesCount!: string;
}
