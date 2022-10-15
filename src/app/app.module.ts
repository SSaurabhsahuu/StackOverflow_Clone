import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { DataService } from './data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule, MatToolbarModule } from '@angular/material';
import { NetworkInterceptor } from './network.interceptor';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { AnswerDetailComponent } from './answer-detail/answer-detail.component';
// import { MatButtonModule,MatToolbarModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionDetailComponent,
    AskQuestionComponent,
    AuthComponent,
    HeaderComponent,
    AnswerDetailComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [
    DataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
