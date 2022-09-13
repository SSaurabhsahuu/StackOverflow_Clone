import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  questionTitle:any;
  questionBody:any;
  postId :any;
  onSubmit(newQuestion:any) {
    if (newQuestion.invalid) {
      return;
    }
    console.log(newQuestion.value.questionTitle);

    const body =
      {
           "questionTitle": newQuestion.value.questionTitle ,
          "questionDesc":  newQuestion.value.questionBody,
          "views": 0,
          "username": "saurabh",
          "answers": null
      };
    //   {
    //     "questionTitle": "How to learn Dp ?",
    // "questionDesc": "If you forget it after sometime ;)",
    // "views": 0,
    // "username": "saurabh",
    // "answers": null
    // }
    this.http.post<any>('https://personal-stackoverflow.herokuapp.com/api/rest/question',body).subscribe(data => {
      this.postId = data.id;
  })
  
    // this.cService.addProfileDetails(submittedForm.value);

  
    // this.router.navigate([`/courses`]);

  }
}
