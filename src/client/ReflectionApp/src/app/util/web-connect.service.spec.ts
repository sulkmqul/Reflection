import { TestBed } from '@angular/core/testing';

import { WebConnectService } from './web-connect.service';

describe('WebConnectService', () => {
  let service: WebConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
