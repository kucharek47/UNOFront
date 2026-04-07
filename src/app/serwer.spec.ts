import { TestBed } from '@angular/core/testing';

import { Serwer } from './serwer';

describe('Serwer', () => {
  let service: Serwer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Serwer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
