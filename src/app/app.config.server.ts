import { mergeApplicationConfig, ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return () => {
          const app = initializeApp(environment.firebase);
          getFirestore(app); // Initialize Firestore
          // Initialize other Firebase services that are safe to use on the server
        };
      },
      multi: true
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

// This configuration ensures Firebase is initialized safely for SSR,
// only including services that work on the server (like Firestore).
