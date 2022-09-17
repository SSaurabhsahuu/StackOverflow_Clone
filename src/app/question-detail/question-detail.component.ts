import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {

  dataService:DataService;
  question: any;
  answerBody:any;
  userStatus:any;

  dataChange = new Subject<void>(); // subject is event emitter

  constructor(private http: HttpClient,dataService:DataService) { 
   this.dataService = dataService;
  }

  ngOnInit(): void {
    if(this.dataService.questionId != undefined){
      this.http.get<any>('https://personal-stackoverflow.herokuapp.com/api/rest/question/'+this.dataService.questionId).subscribe(data => {
        this.question = data;
        localStorage.setItem("question",  JSON.stringify(this.question));
        console.log("data",data)
    })
    }
    else{
      this.question =  JSON.parse(localStorage.getItem("question") || '{}');
    }

    this.dataChange.subscribe(()=>{
      this.http.get<any>('https://personal-stackoverflow.herokuapp.com/api/rest/question/'+this.dataService.questionId).subscribe(data => {
        this.question = data;
        localStorage.setItem("question",  JSON.stringify(this.question));
        console.log("data change",data)
    })})
    // new Observable(observer => {
    //   setTimeout(()=>{
    //     observer.next("In progress");
    //   },2000)

    //   setTimeout(()=>{
    //     observer.next("started");
    //   },4000)
    //   setTimeout(()=>{
    //     observer.next("completed");
    //   },6000)

    // }).subscribe(data =>{
    //   this.userStatus = data;
    // })
  } 

  writeAnswer(){
    (<HTMLInputElement>document.querySelector(".write")).style.display = "none";
    (<HTMLInputElement>document.querySelector(".writeAnswer")).style.display = "block";
    (<HTMLInputElement>document.querySelector(".cancel")).style.display = "inline-block";
  }
  cancelWrite(){
    (<HTMLInputElement>document.querySelector(".write")).style.display = "inline-block";
    (<HTMLInputElement>document.querySelector(".writeAnswer")).style.display = "none";
    (<HTMLInputElement>document.querySelector(".cancel")).style.display = "none";
  }
  onSubmit(newAnswer:any) {
    (<HTMLInputElement>document.querySelector(".write")).style.display = "inline-block";
    (<HTMLInputElement>document.querySelector(".writeAnswer")).style.display = "none";
    (<HTMLInputElement>document.querySelector(".cancel")).style.display = "none";
    if (newAnswer.invalid) {
      return;
    }
    console.log(newAnswer.value.answer);

    const body = {
    "answer": newAnswer.value.answerBody,
    "views": 0,
    "username": "shyam",
     "votesUp": 0,
    "votesDown": 0
  }
    this.http.post<any>('https://personal-stackoverflow.herokuapp.com/api/rest/answer/'+this.question.id,body).subscribe(data => {
      // this.postId = data.id;
      console.log("new Answer ",data);

      this.dataChange.next();// event emit so that subscribe can listen to it
  })
  
    // this.router.navigate([`/courses`]);

  }

}
