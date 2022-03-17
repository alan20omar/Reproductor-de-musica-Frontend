import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';

import { AuthGuardGuard } from './auth-guard.guard';

describe('AuthGuardGuard', () => {
  let guard: AuthGuardGuard;

  let checkCookie: boolean;
  let fakeCookieService: CookieService;

  beforeEach(() => {
    fakeCookieService = jasmine.createSpyObj<CookieService>( 'fakeCookieService', {
      check: checkCookie,
    });

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: CookieService, useValue: fakeCookieService },
      ]
    });
    guard = TestBed.inject(AuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
