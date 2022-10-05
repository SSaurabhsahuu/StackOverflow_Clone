import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  searchResult: any;
  searchFor: any;
  dataService: DataService;
  user: any;
  length: any;
  constructor(
    private http: HttpClient,
    dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {
    this.dataService = dataService;
  }
  ngOnInit(): void {
    this.authService.user.subscribe((data) => {
      this.user = data;
    });

    if (localStorage.getItem('userData') != null)
      this.user = JSON.parse(localStorage.getItem('userData') || '');
  }
  search() {
    this.http
      .get<any>(
        'https://personal-stackoverflow.herokuapp.com/api/rest/questions/' +
          this.searchFor
      )
      .subscribe((data) => {
        this.dataService.questions = data;
        console.log('question ', this.dataService.questions);

        this.dataService.search.next();

        this.length = this.dataService.questions.length;
        console.log('data ', data);
        this.router.navigate([`/`]);
        console.log('routing');
      });
  }
  onLogout() {
    this.authService.logout();
  }
}
