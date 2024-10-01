import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService, AuthErrorType } from '../../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MatButtonModule, ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  initializeRegisterForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { mismatch: true };
  }

  async register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { email, password } = this.registerForm.value;
      try {
        await this.authService.register(email, password);
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Registration successful!'});
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
