import { TestBed, inject } from '@angular/core/testing';

import { LegislatorsService } from './legislators.service';

describe('LegislatorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LegislatorsService]
    });
  });

  it('should be created', inject([LegislatorsService], (service: LegislatorsService) => {
    expect(service).toBeTruthy();
  }));
});
