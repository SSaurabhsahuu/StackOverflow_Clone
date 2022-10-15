import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-answer-detail',
  templateUrl: './answer-detail.component.html',
  styleUrls: ['./answer-detail.component.css'],
})
export class AnswerDetailComponent implements OnInit {
  @Input() answer: any;
  voteFlag = 0;
  dataService: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    dataService: DataService,
    public loader: LoadingService
  ) {
    this.dataService = dataService;
  }
  ngOnInit(): void {}

  voteStatus() {
    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '').token,
    };
    this.http
      .get<any>(
        'https://personal-stackoverflow.herokuapp.com/api/rest/ques/vote/' +
          this.dataService.questionId,
        { headers }
      )
      .subscribe({
        next: (data) => {
          this.voteFlag = data.votes;
          console.log('vote status ', data);
        },
        error: (errorMessage) => {
          console.log(errorMessage);
          this.voteFlag = 0;
          console.log(errorMessage.status);
          // this.error = errorMessage;

          // this.isLoading = false;
        },
      });
  }
  // vote(value: number, e: any, id: any) {
  //   if (localStorage.getItem('userData') == null) {
  //     this.gotoLogin();
  //   } else {
  //     console.log('head ', localStorage.getItem('userData'));
  //     const headers = {
  //       Authorization:
  //         'Bearer ' + JSON.parse(localStorage.getItem('userData') || '').token,
  //     };
  //     console.log('header ', headers);
  //     this.http
  //       .put<any>(
  //         'https://personal-stackoverflow.herokuapp.com/api/rest/' +
  //           e +
  //           '/' +
  //           id +
  //           '/' +
  //           value,
  //         null,
  //         { headers }
  //       )
  //       .subscribe((data) => {
  //         // this.postId = data.id;
  //         console.log('new Answer ', data);
  //         // this.closeModal()
  //         this.dataChange.next(); // event emit so that subscribe can listen to it
  //       });
  //   }
  // }
}
