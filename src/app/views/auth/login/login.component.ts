import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthErrorType, AuthService,  } from '../../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MatButtonModule, ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;

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
        await this.authService.login(email, password);
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Login successful!',life: 3000})
        setTimeout(() => {
          this.router.navigate(['/fireblog/posts'])
        }, 3000);
      } catch (error: any) {
        this.handleRegistrationError(error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.messageService.add({severity:'warn', summary: 'Warning', detail: 'Please fill in all required fields correctly.'});
    }
  }

  private handleRegistrationError(error: { type: AuthErrorType, message: string }) {
    let errorMessage: string;
    switch (error.type) {
      case AuthErrorType.EmailAlreadyInUse:
        errorMessage = 'This email is already in use. Please try a different email.';
        break;
      case AuthErrorType.WeakPassword:
        errorMessage = 'The password is too weak. Please choose a stronger password.';
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
