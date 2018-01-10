import { TestBed, inject } from '@angular/core/testing';

import { D3GeoStatePlaneService } from './d3-geo-state-plane.service';

describe('D3GeoStatePlaneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D3GeoStatePlaneService]
    });
  });

  it('should be created', inject([D3GeoStatePlaneService], (service: D3GeoStatePlaneService) => {
    expect(service).toBeTruthy();
  }));
});
