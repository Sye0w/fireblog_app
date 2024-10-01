import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment.development';

// Initialize Firebase for SSR
const app = initializeApp(environment.firebase);

export default function bootstrap() {
  return bootstrapApplication(AppComponent, config);
}

export const AppServerModule = {
  bootstrap: [AppComponent],
};
