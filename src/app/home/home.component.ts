import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LoadingService } from '../loading.service';
import { AuthService } from '../auth/auth.service';
// import icons from '../../assets/icons.svg';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // encapsulation: ViewEncapsulation.None, // for style to working with [innerHTML]
})
export class HomeComponent implements OnInit {
  questions: any;
  length: any;
  searchResult: any;
  searchFor: any;
  dataService: DataService;
  loading$ = this.loader.loading$;
  user: any;
  constructor(
    private http: HttpClient,
    dataService: DataService,
    private authService: AuthService,
    public loader: LoadingService
  ) {
    console.log('constructor ');
    this.dataService = dataService;
    this.questions = this.dataService.questions;

    this.length =
      this.questions == undefined ? undefined : this.questions.length;
  }
  // ngAfterViewInit(): void {
  //   this.renderSpinner((<HTMLInputElement>document.querySelector(".question-box")))
  // }

  ngOnInit(): void {
    console.log('ngInit');
    if (this.questions == undefined) this.getQuestions();

    this.dataService.dataChange.subscribe(() => {
      console.log('dataservice');
      this.getQuestions();
    });
    this.dataService.search.subscribe(() => {
      this.questions = this.dataService.questions;
      this.length = this.questions.length;
      console.log('qqq ', this.questions, this.length);
    });
    this.authService.user.subscribe((data) => {
      this.user = data;
    });

    if (localStorage.getItem('userData') != null)
      this.user = JSON.parse(localStorage.getItem('userData') || '');
  }
  getQuestions() {
    // const headers = {
    //   Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData') || '').token,
    // };
    console.log('token value ', localStorage.getItem('userData'));

    this.http
      .get<any>(
        'https://personal-stackoverflow.herokuapp.com/api/rest/questions'
      )
      .subscribe((data) => {
        this.questions = data.reverse();
        this.length = this.questions.length;
        // console.log("data ",data)
      });
  }

  openQuestion(qId: any) {
    this.dataService.questionId = qId;
    const headers = {
      Authorization: 'Bearer ' + localStorage.getItem('userData'),
    };
    this.http
      .put<any>(
        'https://personal-stackoverflow.herokuapp.com/api/rest/question/views/' +
          this.dataService.questionId,
        { headers }
      )
      .subscribe((data) => {
        console.log(' views updated');
      });
  }
}
