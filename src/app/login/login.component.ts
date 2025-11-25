import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() onSuccess?: (token: string) => void;
  @Input() onError?: (error: Error) => void;

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private elementRef: ElementRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    console.log(this.loginForm.value)
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    // ============================================
    // EMIT EVENT TO HOST (Next.js) - Host will handle authentication
    // ============================================
    const loginEvent = new CustomEvent('loginSubmit', {
      detail: { email, password },
      bubbles: true,
      composed: true // Important for Web Components
    });
    this.elementRef.nativeElement.dispatchEvent(loginEvent);
    console.log('🚀 [Angular Remote] Login event emitted to host:', { email });

    // ============================================
    // ORIGINAL LOGIC - COMMENTED OUT (Host will handle this)
    // ============================================
    /*
    try {
      // Replace with your actual API endpoint
      const response: any = await this.http.post('https://api.example.com/auth/login', {
        email,
        password
      }).toPromise();

      const token = response.access_token || response.token;

      if (this.onSuccess) {
        this.onSuccess(token);
      }
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Login failed. Please try again.';

      if (this.onError) {
        this.onError(error);
      }
    } finally {
      this.isLoading = false;
    }
    */

    // Reset loading after event dispatch (host will handle actual loading state)
    // Comment this if you want host to control loading state
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  // Public method for host to set error message
  public setError(message: string) {
    this.errorMessage = message;
    this.isLoading = false;
  }

  // Public method for host to set loading state
  public setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
