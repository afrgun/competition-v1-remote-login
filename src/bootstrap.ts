import 'zone.js';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { LoginComponent } from './app/login/login.component';
import { appConfig } from './app/app.config';

// Create Angular application
createApplication(appConfig).then((appRef) => {
  // Convert LoginComponent to Web Component
  const loginElement = createCustomElement(LoginComponent, {
    injector: appRef.injector,
  });

  // Register as custom element
  if (!customElements.get('angular-login')) {
    customElements.define('angular-login', loginElement);
    console.log('✅ Web Component "angular-login" registered successfully');
  }
}).catch((err) => console.error('❌ Failed to register Web Component:', err));
