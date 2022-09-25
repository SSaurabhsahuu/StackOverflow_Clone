import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';

import { catchError, tap } from 'rxjs/operators';

import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import jwt_decode from 'jwt-decode';

export interface AuthResponseData {
  username?: string;
  passwordHash?: string;
  token: string;
  authorities: [];
  // kind: string;
  // idToken: string;
  // refreshToken: string;
  // expiresIn: string;
  // localId: string;
  // registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null); // store user data
  base_url = 'https://personal-stackoverflow.herokuapp.com/';
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.base_url + 'api/rest/user', {
        username: username,
        password: password,
        authorities: [],
      })
      .pipe(
        catchError(this.handleError)
        // ,
        // tap((resData) => {
        //   this.handleAuthentication(resData);
        // })
      );
  }

  login(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.base_url + 'login', {
        username: username,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(resData);
        })
      );
  }
  private handleAuthentication(userData: AuthResponseData) {
    // const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    let res: any = jwt_decode(userData.token);
    console.log('token   ', res);
    const userObj = new User(res.sub, userData.token);

    this.user.next(userObj); // user data modified

    // this.autoLogout(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(userObj));
    console.log('token value ', localStorage.getItem('userData'));
  }
  autoLogin() {
    // const userData: {
    //   email: string;
    //   id: string;
    //   _token: string;
    //   _tokenExpirationDate: string;
    // } = JSON.parse(localStorage.getItem('userData') || '{}');
    // if (!userData) {
    //   return;
    // }
    // const loadedUser = new User(userData.email, userData._token);
    // if (loadedUser.token) {
    //   this.user.next(loadedUser);
    //   const expirationDuration =
    //     new Date(userData._tokenExpirationDate).getTime() -
    //     new Date().getTime();
    //   this.autoLogout(expirationDuration);
    // }
  }

  logout() {
    this.user.next(null);

    // this.router.navigate(['/auth']);

    localStorage.removeItem('userData');

    // if (this.tokenExpirationTimer) {
    //   clearTimeout(this.tokenExpirationTimer);
    // }

    // this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log('error ', errorRes);
    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }

    return throwError(errorMessage);
  }
}
