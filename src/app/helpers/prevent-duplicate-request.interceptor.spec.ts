import { TestBed } from '@angular/core/testing';

import { PreventDuplicateRequestInterceptor } from './prevent-duplicate-request.interceptor';

describe('PreventDuplicateRequestInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      PreventDuplicateRequestInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: PreventDuplicateRequestInterceptor = TestBed.inject(PreventDuplicateRequestInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
