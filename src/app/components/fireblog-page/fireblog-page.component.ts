import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from "../post-card/post-card.component";
import { CreatePostComponent } from "../create-post/create-post.component";
import { UserProfileComponent } from "../../views/auth/user-profile/user-profile.component";

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
    UserProfileComponent
]
})
export class FireblogPageComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSidebarOpen = false;


  ngOnInit(): void {}

  toggleSidebar(event: boolean) {
    this.isSidebarOpen = event;
    this.sidenav.toggle();
  }


}
