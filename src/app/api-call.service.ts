import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
  constructor(private http: HttpClient) {}

  BaseURl = 'https://personal-stackoverflow.herokuapp.com/';
  headers = {
    Authorization:
      'Bearer ' + JSON.parse(localStorage.getItem('userData') || '{}').token,
  };

  getUserQuestions() {
    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '{}').token,
    };

    return this.http.get<any>(this.BaseURl + 'api/rest/users/questions', {
      headers,
    });
  }
  getUserAnswers() {
    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '{}').token,
    };
    return this.http.get<any>(this.BaseURl + 'api/rest/users/answers', {
      headers,
    });
  }
}
