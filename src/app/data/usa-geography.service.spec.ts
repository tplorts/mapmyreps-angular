import { TestBed, inject } from '@angular/core/testing';

import { UsaGeographyService } from './usa-geography.service';

describe('UsaGeographyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsaGeographyService]
    });
  });

  it('should be created', inject([UsaGeographyService], (service: UsaGeographyService) => {
    expect(service).toBeTruthy();
  }));
});
