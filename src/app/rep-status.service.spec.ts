import { TestBed, inject } from '@angular/core/testing';

import { RepStatusService } from './rep-status.service';

describe('RepStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepStatusService]
    });
  });

  it('should be created', inject([RepStatusService], (service: RepStatusService) => {
    expect(service).toBeTruthy();
  }));
});
