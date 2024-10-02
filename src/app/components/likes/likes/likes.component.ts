import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [MatBadgeModule,CommonModule],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.scss'
})

export class LikesComponent {
  likesCount: number = 2;
}
