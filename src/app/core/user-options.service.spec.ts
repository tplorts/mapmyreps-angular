import { TestBed, inject } from '@angular/core/testing';

import { UserOptionsService } from './user-options.service';

describe('UserOptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserOptionsService]
    });
  });

  it('should be created', inject([UserOptionsService], (service: UserOptionsService) => {
    expect(service).toBeTruthy();
  }));
});
