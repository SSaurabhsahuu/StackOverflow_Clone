import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // totalAngularPackages:any;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
 
  this.http.get<any>('https://personal-stackoverflow.herokuapp.com/api/rest/questions').subscribe(data => {
      this.questions = data;
      // console.log("data ",data)
  })
  
  }
  // getQuestions() {
  //   return axiosconfig
  //     .get('questions')
  //     .then(function (response: any) {
  //       return response;
  //     })
  //     .catch(function (error: any) {
  //       // handle error
  //       console.log('error advertisement/getAll >>>', error);
  //     });
  //   }
  questions:any =[
      {id:0, question:"How to start Web Development ?", views:2, userId:0, userName:"Mohan" ,date:"12 Aug 2022"},
      {id:1, question:"How to start DSA ?", views:4, userId:1, userName:"Sohan" ,date:"12 Sept 2022" },
      {id:2, question:"How to initialize a vector in c++ dfds fgfd dg ?", views:7, userId:0, userName:"Shyam" , date:"13 Aug 2021" }
    ];
    searchFor:any;
    search(){

      for(const ele of this.questions){
        if(ele.question.includes(this.searchFor)){

        }
      }
    }
}
