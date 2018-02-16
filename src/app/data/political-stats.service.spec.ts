import { TestBed, inject } from '@angular/core/testing';

import { PoliticalStatsService } from './political-stats.service';

describe('PoliticalStatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoliticalStatsService]
    });
  });

  it('should be created', inject([PoliticalStatsService], (service: PoliticalStatsService) => {
    expect(service).toBeTruthy();
  }));
});
