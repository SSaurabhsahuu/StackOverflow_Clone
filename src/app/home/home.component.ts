import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  questions:any;
  length:any;
  searchResult:any;
  searchFor:any;
  dataService:DataService;

  constructor(private http: HttpClient,dataService:DataService) { 
   this.dataService = dataService;
  }

  getQuestions(){
    this.http.get<any>('https://personal-stackoverflow.herokuapp.com/api/rest/questions').subscribe(data => {
      this.questions = data.reverse();
      this.length = this.questions.length;
      // console.log("data ",data)
  })
  }
  ngOnInit(): void {
 
  this.getQuestions();
  
  this.dataService.dataChange.subscribe(()=>{
    this.getQuestions();
  })
  }

    search(){
      this.http.get<any>('https://personal-stackoverflow.herokuapp.com/api/rest/questions/'+this.searchFor).subscribe(data => {
      this.questions  = data;
      this.length = this.questions.length;
       console.log("data ",data)
      })
    }
    openQuestion(qId:any){
      this.dataService.questionId = qId;
      this.http.put<any>('https://personal-stackoverflow.herokuapp.com/api/rest/question/views/'+this.dataService.questionId,{}).
      subscribe(data => {
        console.log(" views updated");
      })
    }
}
