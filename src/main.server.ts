import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment.development';

// Initialize Firebase for SSR
const app = initializeApp(environment.firebase);

bootstrapApplication(AppComponent, config)
  .catch((err) => console.error(err));
