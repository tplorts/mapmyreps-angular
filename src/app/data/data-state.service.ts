import { Injectable } from '@angular/core';

import { BackendService } from './backend.service';


class DataState {
  key: string;
  type: string;
  value: any;
}

@Injectable()
export class DataStateService {

  constructor(private backend: BackendService) {
    this.backend.fetchAll('DataStates').subscribe(next => console.log(next));
  }

}
