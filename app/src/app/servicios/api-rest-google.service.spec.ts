import { TestBed } from '@angular/core/testing';

import { ApiRestGoogleService } from './api-rest-google.service';

describe('ApiRestGoogleService', () => {
  let service: ApiRestGoogleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRestGoogleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
