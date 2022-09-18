import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LoadingService } from '../loading.service';
// import icons from '../../assets/icons.svg';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  questions:any;
  length:any;
  searchResult:any;
  searchFor:any;
  dataService:DataService;
  loading$ = this.loader.loading$;

  constructor(private http: HttpClient,dataService:DataService,public loader: LoadingService) { 
   this.dataService = dataService;
  }
  // ngAfterViewInit(): void {
  //   this.renderSpinner((<HTMLInputElement>document.querySelector(".question-box")))
  // }

 
  ngOnInit(): void {
   
  this.getQuestions();
  
  this.dataService.dataChange.subscribe(()=>{
    this.getQuestions();
  })
  }
  getQuestions(){
    this.http.get<any>('https://personal-stackoverflow.herokuapp.com/api/rest/questions').subscribe(data => {
      this.questions = data.reverse();
      this.length = this.questions.length;
      // console.log("data ",data)
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
    //  renderSpinner(parentEle:any){
    //   const html =`<div class="spinner">
    //   <svg>
    //     <use href="../../assets/icons.svg#icon-loader"></use>
    //   </svg>
    // </div>
    //   `;
    //   parentEle.innerHTML = "";
    //   parentEle.insertAdjacentHTML("afterbegin", html);
    // };
}
