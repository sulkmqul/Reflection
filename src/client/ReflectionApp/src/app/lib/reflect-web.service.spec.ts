import { TestBed } from '@angular/core/testing';

import { ReflectWebService } from './reflect-web.service';

describe('ReflectWebService', () => {
  let service: ReflectWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReflectWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
