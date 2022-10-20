import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataService } from '../data.service';
import { ApiCallService } from '../api-call.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
  encapsulation: ViewEncapsulation.None, // for style to working with [innerHTML]
})
export class AskQuestionComponent implements OnInit {
  questionTitle: any;
  questionBody: any;
  // postId: any;
  dataService: DataService;
  apiCallService: ApiCallService;
  questionOutput: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    dataService: DataService,
    apiCall: ApiCallService
  ) {
    this.dataService = dataService;
    this.apiCallService = apiCall;
  }

  ngOnInit(): void {}
  cancelEdit() {
    this.dataService.editObj.editFlag = false;
    this.dataService.dataChange.next();
  }
  addBreak(str: any) {
    return str.replace(/\n/g, '<br>');
  }
  addBold() {
    this.questionBody += '⁞ Bold text ⁞';
    this.dataService.editObj.questionDesc += '⁞ Bold text ⁞';
  }
  addCode() {
    this.questionBody += '\n⁗ write code here ⁗';
    this.dataService.editObj.questionDesc += '\n⁗ write code here ⁗';
  }
  addStyle(str: any) {
    str = this.addBreak(str);

    while (str.search('⁞') != -1) {
      str = str.replace('⁞', `<p class="bold">`);
      str = str.replace('⁞', `</p>`);
    }
    while (str.search('<br>⁗') != -1) {
      str = str.replace('<br>⁗', `<div class="descP">`);
      str = str.replace('⁗', `</div>`);
    }

    this.questionOutput = str;
    return str;
  }
  onSubmit(newQuestion: any, type: any) {
    if (newQuestion.invalid) {
      return;
    }
    const body = {
      questionTitle: newQuestion.value.questionTitle,
      questionDesc: newQuestion.value.questionBody,
    };

    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '{}').token,
    };
    // console.log('token ', headers);

    if (type == 'new') {
      this.http
        .post<any>(
          'https://personal-stackoverflow.herokuapp.com/api/rest/question',
          body,
          { headers }
        )
        .subscribe((data) => {
          console.log(data);
        });

      this.dataService.dataChange.next(); // event emit so that subscribe can listen to it

      this.router.navigate([``]);
    } else {
      this.apiCallService
        .editContent('question', this.dataService.editObj.id, body)
        .subscribe((data) => {
          console.log('edit success', data);
          this.dataService.editObj.editFlag = false;
          this.dataService.dataChange.next(); // event emit so that subscribe can listen to it
        });
    }
  }
}
