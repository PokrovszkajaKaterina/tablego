import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userChangedSubject = new BehaviorSubject<User | null>(null);
  userChanged$ = this.userChangedSubject.asObservable();

  constructor(private http: HttpClient) { }

  // login
  login(email: string, password: string) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<User>('http://localhost:5000/app/login', body, {headers: headers, withCredentials: true})
      .pipe(
        tap((user: User) => {
          this.userChangedSubject.next(user);
        })
      );
  }

  register(user: User) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('name', user.name);
    body.set('address', user.address);
    body.set('nickname', user.nickname);
    body.set('password', user.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/register', body, {headers: headers});
  }

  logout() {
    return this.http.post('http://localhost:5000/app/logout', {}, {withCredentials: true, responseType: 'text'})
      .pipe(
        tap(() => this.userChangedSubject.next(null))
      );
  }

  checkAuth() {
    return this.http.get<boolean>('http://localhost:5000/app/checkAuth', {withCredentials: true});
  }

  getLoggedUserById() {
    return this.http.get<User>(`http://localhost:5000/app/user/${this.userChanged$}`, {withCredentials: true});
  }

  isLoggedIn(): boolean {
    return this.userChangedSubject.getValue() != null;
  }

  isAdmin(): boolean {
    const user = this.userChangedSubject.getValue();
    return user != null && user.role === 'admin';
  }

  getUserId(): string | null {
    const user = this.userChangedSubject.getValue();
    return user != null ? user._id : null;
  }
}
