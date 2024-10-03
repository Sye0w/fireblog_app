import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthErrorType, AuthService } from '../../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,MatDividerModule, MatButtonModule, ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  isForgotPasswordMode: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  initializeLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      try {
        if (this.isForgotPasswordMode) {
          await this.authService.forgotPassword(email);
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Password reset email sent!', life: 3000});
          this.isForgotPasswordMode = false;
        } else {
          await this.authService.login(email, password);
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Login successful!', life: 3000});
          setTimeout(() => {
            this.router.navigate(['/fireblog/posts']);
          }, 3000);
        }
      } catch (error: any) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.messageService.add({severity:'warn', summary: 'Warning', detail: 'Please fill in all required fields correctly.'});
    }
  }

  async googleSignIn() {
    this.isLoading = true;
    try {
      await this.authService.googleSignIn();
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Google sign-in successful!', life: 3000});
      setTimeout(() => {
        this.router.navigate(['/fireblog/posts']);
      }, 3000);
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleForgotPasswordMode() {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    if (this.isForgotPasswordMode) {
      this.loginForm.get('password')?.clearValidators();
    } else {
      this.loginForm.get('password')?.setValidators([Validators.required]);
    }
    this.loginForm.get('password')?.updateValueAndValidity();
  }

  private handleAuthError(error: { type: AuthErrorType, message: string }) {
    let errorMessage: string;
    switch (error.type) {
      case AuthErrorType.UserNotFound:
        errorMessage = 'User not found. Please check your email or sign up.';
        break;
      case AuthErrorType.WrongPassword:
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case AuthErrorType.InvalidEmail:
        errorMessage = 'The email address is invalid. Please enter a valid email.';
        break;
      case AuthErrorType.TooManyRequests:
        errorMessage = 'Too many unsuccessful attempts. Please try again later.';
        break;
      default:
        errorMessage = 'An unexpected error occurred. Please try again.';
    }
    this.messageService.add({severity:'error', summary: 'Error', detail: errorMessage});
  }
}
