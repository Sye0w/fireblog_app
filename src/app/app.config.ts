import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { environment } from '../environments/environment.development';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FireblogFacadeService } from './services/fireblog/fireblog-facade.service';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    providePerformance(() => getPerformance()),
    ScreenTrackingService,
    UserTrackingService,
    provideAnimationsAsync(),
    {
      provide: 'BASE_URL',
      useValue: environment.baseUrl
    },
    { provide: FireblogFacadeService, useClass: FireblogFacadeService },
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};
