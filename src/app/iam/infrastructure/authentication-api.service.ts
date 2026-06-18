import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthenticatedUser } from '../domain/model/authenticated-user.entity';
import { AuthenticationPort } from '../domain/ports/authentication.port';
import { SignInRequest, SignInResponse } from './authentication.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationApiService implements AuthenticationPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.platformProviderApiBaseUrl;
  private readonly authPath = (environment as any).platformProviderAuthenticationEndpointPath || '/api/v1/authentication';

  signIn(email: string, password: string): Observable<AuthenticatedUser> {
    const body: SignInRequest = { email, password };
    return this.http.post<SignInResponse>(`${this.baseUrl}${this.authPath}/sign-in`, body).pipe(
      map(response => new AuthenticatedUser(response.id, response.email, response.fullName, response.token))
    );
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}${this.authPath}/password`, { currentPassword, newPassword });
  }
}
