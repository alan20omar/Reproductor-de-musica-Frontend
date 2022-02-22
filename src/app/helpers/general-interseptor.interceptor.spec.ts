import { TestBed } from '@angular/core/testing';

import { GeneralInterseptorInterceptor } from './general-interseptor.interceptor';

describe('GeneralInterseptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GeneralInterseptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GeneralInterseptorInterceptor = TestBed.inject(GeneralInterseptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
