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

  ngOnInit(): void {
 
  this.http.get<any>('https://personal-stackoverflow.herokuapp.com/api/rest/questions').subscribe(data => {
      this.questions = data;
      this.length = this.questions.length;
      // console.log("data ",data)
  })
  
  }
  
    search(){
      for(const ele of this.questions){
        if(ele.questionTitle.includes(this.searchFor)){
          this.searchResult = ele;
        }
      }
    }
    openQuestion(qId:any){
      this.dataService.questionId = qId;
    }
}
