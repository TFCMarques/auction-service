import { TestBed, inject } from '@angular/core/testing';

import { UnregisterService } from './unregister.service';

describe('RegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnregisterService]
    });
  });

  it('should ...', inject([UnregisterService], (service: UnregisterService) => {
    expect(service).toBeTruthy();
  }));
});
