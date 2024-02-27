import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(provideFirebaseApp(
      () => initializeApp(
        {
          "projectId": "treasurer-334d9",
          "appId": "1:461603429978:web:6f3fe5e3c8c8dfc1290263",
          "storageBucket": "treasurer-334d9.appspot.com",
          "apiKey": "AIzaSyDIO2Em8dTwaLVkIcjUw-sln_SmMSE3eQI",
          "authDomain": "treasurer-334d9.firebaseapp.com",
          "messagingSenderId": "461603429978", "measurementId": "G-41G7J2Q961"
        }))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage()))]
};
