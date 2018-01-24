import { TestBed, inject } from '@angular/core/testing';

import { PreAppLoaderService } from './pre-app-loader.service';

describe('PreAppLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreAppLoaderService]
    });
  });

  it('should be created', inject([PreAppLoaderService], (service: PreAppLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
