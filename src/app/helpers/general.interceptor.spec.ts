import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

import { GeneralInterceptor } from './general.interceptor';

describe('GeneralInterseptor', () => {
  let interceptor: GeneralInterceptor

  let token: string;
  let fakeAuthService: AuthService;
  let fakeCookieService: CookieService;
  
  beforeEach(() => {
    fakeAuthService = jasmine.createSpyObj<AuthService>( 'AuthService', {
      logout: undefined,
    });
    fakeCookieService = jasmine.createSpyObj<CookieService>( 'CookieService', {
      get: token,
    });

    TestBed.configureTestingModule({
      providers: [
        GeneralInterceptor,
        { provide: AuthService, useValue: fakeAuthService },
        { provide: CookieService, useValue: fakeCookieService }
      ]
    });
    interceptor = TestBed.inject(GeneralInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
