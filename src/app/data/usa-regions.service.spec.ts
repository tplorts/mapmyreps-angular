import { TestBed, inject } from '@angular/core/testing';

import { UsaRegionsService } from './usa-regions.service';

describe('UsaRegionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsaRegionsService]
    });
  });

  it('should be created', inject([UsaRegionsService], (service: UsaRegionsService) => {
    expect(service).toBeTruthy();
  }));
});
