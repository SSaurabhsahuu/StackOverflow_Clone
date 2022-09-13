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
  questions:any;
  
    searchFor:any;
    search(){

      for(const ele of this.questions){
        if(ele.question.includes(this.searchFor)){

        }
      }
    }
}
