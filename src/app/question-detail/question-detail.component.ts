import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  constructor(private http: HttpClient,dataService:DataService) { 
   this.dataService = dataService;
  }

  ngOnInit(): void {
    if(this.dataService.questionId != undefined){
      this.http.get<any>('https://personal-stackoverflow.herokuapp.com/api/rest/question/'+this.dataService.questionId).subscribe(data => {
        this.question = data;
        // console.log("data ",data)
    })
    }
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
  })
  
    // this.router.navigate([`/courses`]);

  }

}
