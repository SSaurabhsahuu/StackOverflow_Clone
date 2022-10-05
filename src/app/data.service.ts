import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DataService {
  questionId: any;
  dataChange = new Subject<void>(); // subject is event emitter
  search = new Subject<void>(); // subject is event emitter
  questions: any;
}
