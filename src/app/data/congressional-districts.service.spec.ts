import { TestBed, inject } from '@angular/core/testing';

import { CongressionalDistrictsService } from './congressional-districts.service';

describe('CongressionalDistrictsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CongressionalDistrictsService]
    });
  });

  it('should be created', inject([CongressionalDistrictsService], (service: CongressionalDistrictsService) => {
    expect(service).toBeTruthy();
  }));
});
