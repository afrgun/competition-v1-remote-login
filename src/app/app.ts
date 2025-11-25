import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  template: `
    <app-login
      [onSuccess]="handleSuccess"
      [onError]="handleError">
    </app-login>
  `,
  styles: []
})
export class App {
  handleSuccess = (token: string) => {
    console.log('Login successful! Token:', token);
    alert('Login successful!');
  };

  handleError = (error: Error) => {
    console.error('Login failed:', error);
  };
}
