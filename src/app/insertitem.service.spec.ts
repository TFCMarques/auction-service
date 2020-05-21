import { TestBed, inject } from '@angular/core/testing';

import { InsertitemService } from './insertitem.service';

describe('InsertitemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InsertitemService]
    });
  });

  it('should ...', inject([InsertitemService], (service: InsertitemService) => {
    expect(service).toBeTruthy();
  }));
});
