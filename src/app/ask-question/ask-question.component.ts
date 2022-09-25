import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
  encapsulation: ViewEncapsulation.None, // for style to working with [innerHTML]
})
export class AskQuestionComponent implements OnInit {
  questionTitle: any;
  questionBody: any;
  postId: any;
  dataService: DataService;
  questionOutput: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    dataService: DataService
  ) {
    this.dataService = dataService;
  }

  ngOnInit(): void {}
  addBreak(str: any) {
    return str.replace(/\n/g, '<br>');
  }
  addBold() {
    this.questionBody += '@ Bold text @';
  }
  addCode() {
    this.questionBody += '`write code here`';
  }
  addStyle(str: any) {
    str = this.addBreak(str);

    while (str.search('@') != -1) {
      str = str.replace('@', `<p class="bold">`);
      str = str.replace('@', `</p>`);
    }
    while (str.search('<br>`') != -1) {
      str = str.replace('<br>`', `<div class="descP">`);
      str = str.replace('`', `</div>`);
    }

    this.questionOutput = str;
    return str;
  }
  onSubmit(newQuestion: any) {
    if (newQuestion.invalid) {
      return;
    }
    // console.log(newQuestion.value.questionTitle);
    // let desc = `<h2>hello</h2><br>
    // <p style="background-color:gray;color:red">${newQuestion.value.questionBody}</p>br
    //               `;
    const body = {
      questionTitle: newQuestion.value.questionTitle,
      questionDesc: newQuestion.value.questionBody,
      views: 0,
      username: JSON.parse(localStorage.getItem('userData') || '').username,
      answers: null,
    };

    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '').token,
    };
    this.http
      .post<any>(
        'https://personal-stackoverflow.herokuapp.com/api/rest/question',
        body,
        { headers }
      )
      .subscribe((data) => {
        this.postId = data.id;
      });

    this.dataService.dataChange.next(); // event emit so that subscribe can listen to it

    this.router.navigate([``]);
  }
}
