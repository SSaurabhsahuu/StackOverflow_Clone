import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { DataService } from '../data.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionDetailComponent implements OnInit {
  dataService: DataService;
  question: any;
  answerBody: any;
  answerOutput: any;
  userStatus: any;
  loading$ = this.loader.loading$;
  authRequired = false;
  parentFlag = true;
  voteFlag = 0;
  dataChange = new Subject<void>(); // subject is event emitter

  constructor(
    private http: HttpClient,
    private router: Router,
    dataService: DataService,
    public loader: LoadingService
  ) {
    this.dataService = dataService;
  }

  ngOnInit(): void {
    // let date = new Date();
    // let start = date.getSeconds();
    // console.log('start ', start);

    // const headers = {
    //   Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData') || '').token,
    // };
    if (this.dataService.questionId != undefined) {
      console.log('dsq ', this.dataService.questionId);
      this.http
        .get<any>(
          'https://personal-stackoverflow.herokuapp.com/api/rest/question/' +
            this.dataService.questionId
        )
        .subscribe((data) => {
          this.question = data;

          localStorage.setItem('question', JSON.stringify(this.question));
          console.log('data', data);
        });

      this.voteStatus();
    } else {
      this.question = JSON.parse(localStorage.getItem('question') || '{}');
    }

    this.dataChange.subscribe(() => {
      // console.log('qqq ', JSON.parse(localStorage.getItem('question') || '{}'));
      this.voteStatus();
      this.dataService.questionId = JSON.parse(
        localStorage.getItem('question') || '{}'
      ).id;

      // console.log('data service ', this.dataService.questionId);
      this.http
        .get<any>(
          'https://personal-stackoverflow.herokuapp.com/api/rest/question/' +
            this.dataService.questionId
        )
        .subscribe((data) => {
          this.question = data;
          localStorage.setItem('question', JSON.stringify(this.question));
          console.log('data change', data);
        });
    });
    // new Observable(observer => {
    // let id = this.question != undefined ? this.question.id : null;
    // console.log("id ",id)
    // setTimeout(()=>{
    //   let end = date.getSeconds();
    // console.log("end",end)
    // if(start < end && end-start >=10){
    //   observer.next("In progress");
    // }
    // else if(start > end && (end+60)-start >=10){
    //   observer.next("In progress");
    // }
    // console.log("router ",this.router.url+" id ",this.question.id)
    // if(this.router.url === '/detail' &&  id == this.question.id)
    //   observer.next("In progress");
    // },10000)

    // setTimeout(()=>{
    //   observer.next("started");
    // },4000)
    // setTimeout(()=>{
    //   observer.next("completed");
    // },6000)

    // }).subscribe(data =>{
    //   this.userStatus = data;
    //   this.http.put<any>('https://personal-stackoverflow.herokuapp.com/api/rest/question/views/'+this.dataService.questionId,{}).
    //   subscribe(data => {
    //     console.log(" views updated");
    //   })
    // })
  }

  // openModal = function () {
  //   modal.classList.remove('hidden'); // modal div  width & height is made 50%
  //   overlay.classList.remove('hidden'); // overlay is a div element whose width
  // }; // & height is made 100% & position at top

  // closeModal {
  //   modal.classList.add('hidden');
  //   overlay.classList.add('hidden');
  // };
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

  gotoLogin() {
    if (localStorage.getItem('userData') == null) {
      this.authRequired = true;
    }
  }
  closeModal() {
    this.authRequired = false;
  }
  writeAnswer() {
    if (localStorage.getItem('userData') == null) {
      this.gotoLogin();
    } else {
      (<HTMLInputElement>document.querySelector('.write')).style.display =
        'none';
      (<HTMLInputElement>document.querySelector('.writeAnswer')).style.display =
        'block';
      (<HTMLInputElement>document.querySelector('.cancel')).style.display =
        'inline-block';
    }
  }
  cancelWrite() {
    (<HTMLInputElement>document.querySelector('.write')).style.display =
      'inline-block';
    (<HTMLInputElement>document.querySelector('.writeAnswer')).style.display =
      'none';
    (<HTMLInputElement>document.querySelector('.cancel')).style.display =
      'none';
  }
  addBreak(str: any) {
    return str.replace(/\n/g, '<br>');
  }
  addBold() {
    this.answerBody += '⁞⁞';
  }
  addCode() {
    this.answerBody += '⁗ write code here ⁗';
  }
  addStyle(str: any) {
    str = this.addBreak(str);

    while (str.search('⁞') != -1) {
      str = str.replace('⁞', `<p class="bold" data-placeholder="huhu ">`);
      str = str.replace('⁞', `</p>`);
    }
    while (str.search('⁗') != -1) {
      str = str.replace('⁗', `<div class="descP" placeholder="huhu code">`);
      str = str.replace('⁗', `</div>`);
    }

    this.answerOutput = str;
    return str;
  }
  onSubmit(newAnswer: any) {
    (<HTMLInputElement>document.querySelector('.write')).style.display =
      'inline-block';
    (<HTMLInputElement>document.querySelector('.writeAnswer')).style.display =
      'none';
    (<HTMLInputElement>document.querySelector('.cancel')).style.display =
      'none';
    if (newAnswer.invalid) {
      return;
    }

    const body = {
      answer: newAnswer.value.answerBody,
    };
    const headers = {
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userData') || '').token,
    };
    this.http
      .post<any>(
        'https://personal-stackoverflow.herokuapp.com/api/rest/answer/' +
          this.question.id,
        body,
        { headers }
      )
      .subscribe((data) => {
        // this.postId = data.id;
        console.log('new Answer ', data);

        this.dataChange.next(); // event emit so that subscribe can listen to it
      });

    // this.router.navigate([`/courses`]);
  }

  vote(value: number, e: any, id: any) {
    if (localStorage.getItem('userData') == null) {
      this.gotoLogin();
    } else {
      console.log('head ', localStorage.getItem('userData'));
      const headers = {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('userData') || '').token,
      };
      console.log('header ', headers);
      this.http
        .put<any>(
          'https://personal-stackoverflow.herokuapp.com/api/rest/' +
            e +
            '/' +
            id +
            '/' +
            value,
          null,
          { headers }
        )
        .subscribe((data) => {
          // this.postId = data.id;
          console.log('new Answer ', data);
          // this.closeModal()
          this.dataChange.next(); // event emit so that subscribe can listen to it
        });
    }
  }
}
