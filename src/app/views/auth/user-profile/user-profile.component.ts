import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { Router } from 'express';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../services/blog.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent implements OnInit {
  @ViewChild('imageUpload') imageUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('userAvatar') userAvatar!: ElementRef<HTMLImageElement>;

  user: IUser = {
    email: '',
    password: '',
    image: '',
    username: '',
    uid: ''
  };

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = {
          email: user.email || '',
          password: '',
          image: user.photoURL || '',
          username: user.displayName || '',
          uid: user.uid
        };
      }
    });
  }

  onUploadButtonClick() {
    this.imageUpload.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result && this.userAvatar) {
          this.userAvatar.nativeElement.src = e.target.result as string;
          this.user.image = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async saveChanges() {
    try {
      await this.authService.updateUserProfile(this.user);
      this.snackBar.open('Profile updated successfully', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      let errorMessage = 'An unexpected error occurred while updating the profile.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      this.snackBar.open(`Error updating profile: ${errorMessage}`, 'Close', {
        duration: 5000,
      });
    }
  }

  async logOut() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
      this.snackBar.open('Error logging out', 'Close', {
        duration: 3000,
      });
    }
  }
}
