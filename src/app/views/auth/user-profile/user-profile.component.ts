import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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

export class UserProfileComponent {
logOut() {
throw new Error('Method not implemented.');
}
  @ViewChild('imageUpload') imageUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('userAvatar') userAvatar!: ElementRef<HTMLImageElement>;

  constructor(private snackBar: MatSnackBar) {}

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
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges() {
    // Implement save functionality here
    this.snackBar.open('Changes saved successfully', 'Close', {
      duration: 3000,
    });
  }
}
