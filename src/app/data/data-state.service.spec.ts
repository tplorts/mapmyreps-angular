import { TestBed, inject } from '@angular/core/testing';

import { DataStateService } from './data-state.service';

describe('DataStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataStateService]
    });
  });

  it('should be created', inject([DataStateService], (service: DataStateService) => {
    expect(service).toBeTruthy();
  }));
});
