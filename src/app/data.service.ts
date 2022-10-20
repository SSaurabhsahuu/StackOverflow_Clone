import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable()
export class DataService {
  questionId: any;
  questions: any;
  editObj: any = {
    id: null,
    questionTitle: '',
    questionDesc: '',
    editFlag: false,
  };

  dataChange = new Subject<void>(); // subject is event emitter
  search = new Subject<void>(); // subject is event emitter

}
