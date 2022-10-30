import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiCallService } from '../api-call.service';
import { DataService } from '../data.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: any;
  questions: any;
  answers: any;
  apiCallService: ApiCallService;
  dataService: DataService;
  loading$ = this.loader.loading$;

  constructor(
    private http: HttpClient,
    apiCall: ApiCallService,
    dataService: DataService,
    public loader: LoadingService
  ) {
    this.dataService = dataService;
    this.apiCallService = apiCall;
  }

  ngOnInit(): void {
    console.log('ngonint user profile');

    this.user = JSON.parse(localStorage.getItem('userData') || '{}');

    console.log('usser ', this.user);
    console.log('answers ', this.answers);
    console.log('quetion ', this.questions);
    this.getQuestions();
  }
  getQuestions() {
    this.questions = null;
    this.answers = null;
    console.log('json ', JSON.parse(localStorage.getItem('userData') || '{}'));
    this.apiCallService.getUserQuestions().subscribe({
      next: (data) => {
        console.log('user questions ', data);
        this.questions = data;
      },
      error: (errorMessage) => {
        console.log(errorMessage);
      },
    });
  }
  getAnswers() {
    this.questions = null;
    this.answers = null;
    this.apiCallService.getUserAnswers().subscribe({
      next: (data) => {
        console.log('user answers ', data);
        this.answers = data;
      },
      error: (errorMessage) => {
        console.log(errorMessage);
      },
    });
  }
  onDelete(type: any, id: any) {
    this.apiCallService.deleteContent(type, id).subscribe({
      next: (data) => {
        console.log('deleted ', data);
        if (type == 'question') this.getQuestions();
        else {
          this.getAnswers();
        }
      },
      error: (errorMessage) => {
        console.log(errorMessage);
      },
    });
  }
  openQuestion(qId: any) {
    this.dataService.questionId = qId;
    // const headers = {
    //   Authorization: 'Bearer ' + localStorage.getItem('userData'),
    // };
    this.http
      .put<any>(
        'https://personal-stackoverflow.herokuapp.com/api/rest/question/views/' +
          this.dataService.questionId,
        {}
      )
      .subscribe((data) => {
        console.log(' views updated');
      });
  }
}
