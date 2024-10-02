import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, User, AuthError } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../blog.interface';

export enum AuthErrorType {
  EmailAlreadyInUse = 'auth/email-already-in-use',
  WeakPassword = 'auth/weak-password',
  UserNotFound = 'auth/user-not-found',
  WrongPassword = 'auth/wrong-password',
  InvalidEmail = 'auth/invalid-email',
  TooManyRequests = 'auth/too-many-requests',
  Default = 'auth/default'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    });
  }

  async register(email: string, password: string): Promise<IUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return this.createUserObject(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  async googleSignIn(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  private handleAuthError(error: AuthError): { type: AuthErrorType, message: string } {
    let errorType: AuthErrorType;
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorType = AuthErrorType.EmailAlreadyInUse;
        break;
      case 'auth/weak-password':
        errorType = AuthErrorType.WeakPassword;
        break;
      case 'auth/user-not-found':
        errorType = AuthErrorType.UserNotFound;
        break;
      case 'auth/wrong-password':
        errorType = AuthErrorType.WrongPassword;
        break;
      case 'auth/invalid-email':
        errorType = AuthErrorType.InvalidEmail;
        break;
      case 'auth/too-many-requests':
        errorType = AuthErrorType.TooManyRequests;
        break;
      default:
        errorType = AuthErrorType.Default;
    }
    return { type: errorType, message: error.message };
  }

   private createUserObject(user: User): IUser {
    return {
      email: user.email!,
      password: '', // We don't store the password
      image: user.photoURL || '',
      username: user.displayName || '',
      uid: user.uid
    };
  }
}
