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
  expiresIn: string;
  // localId: string;
  // registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null); // store user data
  base_url = 'https://personal-stackoverflow.herokuapp.com/';
  private tokenExpirationTimer: any;
  public expiresIn: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.base_url + 'api/rest/user', {
        username: username,
        password: password,
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
  dateToNumber(time: any) {
    let curr = '' + time;
    let num = Number.parseInt(curr.slice(0, 10));
    return num;
  }
  private handleAuthentication(userData: any) {
    // const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    let res: any = jwt_decode(userData.token);
    console.log('token   ', res);

    const userObj = new User(res.sub, userData.token, res.exp);
    console.log(
      'expire ',
      userData.date,
      this.dateToNumber(new Date().getTime())
    );
    this.user.next(userObj); // user data modified

    this.autoLogout(res.exp - this.dateToNumber(new Date().getTime()));
    // this.autoLogout(1500);
    localStorage.setItem('userData', JSON.stringify(userObj));
    console.log('token value ', localStorage.getItem('userData'));
  }
  autoLogin() {
    const loadedUser: User = JSON.parse(
      localStorage.getItem('userData') || '{}'
    );
    if (!loadedUser) {
      console.log('user ', loadedUser);
      return;
    }
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        Number(loadedUser.tokenExpirationDate) -
        this.dateToNumber(new Date().getTime());
      this.expiresIn = expirationDuration / 60;
      console.log('token expire in ', this.expiresIn);
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    console.log(' Logout .. ');
    this.user.next(null);

    // this.router.navigate(['/auth']);

    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
    // window.location.reload();
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      console.log('auto logout');
      this.logout();
    }, expirationDuration * 1000);
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
