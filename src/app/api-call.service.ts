import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
  constructor(private http: HttpClient) {}

  BaseURl = 'https://personal-stackoverflow.herokuapp.com/';
  // headers does not work
  // headers = {
  //   Authorization:
  //     'Bearer ' + JSON.parse(localStorage.getItem('userData') || '{}').token,
  // };

  getUserQuestions() {
    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '{}').token,
    };

    let req = this.http.get<any>(this.BaseURl + 'api/rest/users/questions', {
      headers,
    });

    return req;
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
  editContent(type: any, id: any, body: any) {
    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '{}').token,
    };

    return this.http.put<any>(
      'https://personal-stackoverflow.herokuapp.com/api/rest/' +
        type +
        '/' +
        id,
      body,
      { headers }
    );
  }
  deleteContent(type: any, id: any) {
    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '{}').token,
    };
    return this.http.delete<any>(this.BaseURl + 'api/rest/' + type + '/' + id, {
      headers,
    });
  }
}
