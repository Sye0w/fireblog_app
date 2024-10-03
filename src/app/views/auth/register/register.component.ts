import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthErrorType } from '../../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IUser } from '../../../services/blog.interface';
import { FireblogFacadeService } from '../../../services/fireblog/fireblog-facade.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MatButtonModule, ReactiveFormsModule, CommonModule, ToastModule,MatDividerModule],
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
    private messageService: MessageService,
    private router: Router,
    private blogFacade: FireblogFacadeService
  ) {}

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  initializeRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
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
      const { username, email, password } = this.registerForm.value;
      try {
        const user: IUser = await this.authService.register(email, password);
        user.username = username;
        await this.authService.updateUserProfile(user);
        await this.blogFacade.createEmptyBlogPost(user);
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Registration successful!', life: 2500});
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.router.navigate(['/auth/login']);
      } catch (error: any) {
        console.error('Registration error:', error);
        this.handleRegistrationError(error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.messageService.add({severity:'warn', summary: 'Warning', detail: 'Please fill in all required fields correctly.'});
    }
  }

  async signInWithGoogle() {
    this.isLoading = true;
    try {
      await this.authService.googleSignIn();
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Google sign-in successful!', life: 2500});
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      this.handleRegistrationError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleRegistrationError(error: any) {
    console.error('Full error object:', error);
    let errorMessage: string;

    if (error && error.type) {
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
          errorMessage = `An unexpected error occurred: ${error.message || 'Unknown error'}`;
      }
    } else {
      errorMessage = 'An unexpected error occurred. Please try again.';
    }

    this.messageService.add({severity:'error', summary: 'Error', detail: errorMessage});
  }
}
