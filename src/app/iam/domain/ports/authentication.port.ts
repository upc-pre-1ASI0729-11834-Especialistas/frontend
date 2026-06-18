import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../model/authenticated-user.entity';

export abstract class AuthenticationPort {
  abstract signIn(email: string, password: string): Observable<AuthenticatedUser>;
  abstract updatePassword(currentPassword: string, newPassword: string): Observable<void>;
}
