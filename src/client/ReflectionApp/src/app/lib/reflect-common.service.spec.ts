import { TestBed } from '@angular/core/testing';

import { ReflectCommonService } from './reflect-common.service';

describe('ReflectCommonService', () => {
  let service: ReflectCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReflectCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
