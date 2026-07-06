import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../application/auth.store';

@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['confirmed'] === 'true') {
        this.successMessage = 'Account confirmed successfully! Please sign in.';
      }
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSignIn(): void {
    if (this.email && this.password) {
      this.authStore.signIn(this.email, this.password);
    }
  }

  onClearTestUsers(): void {
    this.authStore.cleanTestUsers(() => {
      this.successMessage = 'All test users cleared successfully! Admin was preserved.';
      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
    });
  }
}
