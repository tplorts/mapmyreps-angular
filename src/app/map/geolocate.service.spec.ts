import { TestBed, inject } from '@angular/core/testing';

import { GeolocateService } from './geolocate.service';

describe('GeolocateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeolocateService]
    });
  });

  it('should be created', inject([GeolocateService], (service: GeolocateService) => {
    expect(service).toBeTruthy();
  }));
});
