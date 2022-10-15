import { Component, Input } from '@angular/core';

import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = '';
  @Input() flag = false;
  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const username = form.value.username;

    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    // this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(username, password);
    } else {
      authObs = this.authService.signup(username, password);
    }

    authObs.subscribe({
      next: (resData) => {
        console.log(resData);
       
        // this.isLoading = false;
        if (this.flag == false) this.router.navigate(['/']);
        else window.location.reload();
      },
      error: (errorMessage) => {
        console.log(errorMessage);

        this.error = errorMessage;

        // this.isLoading = false;
      },
    });

    form.reset();
  }
}
