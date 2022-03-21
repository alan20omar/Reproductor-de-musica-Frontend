import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AuthGuardGuard } from './auth-guard.guard';

describe('AuthGuardGuard', () => {
  let guard: AuthGuardGuard;

  const expectedTokenName: string = 'auth_token';
  let mockCookieService: jasmine.SpyObj<CookieService>;
  let mockRouter: jasmine.SpyObj<Router>;
  
  beforeEach(() => {
    mockCookieService = jasmine.createSpyObj<CookieService>('mockCookieService', ['check']);
    mockRouter = jasmine.createSpyObj<Router>('Router', {
      navigate: undefined,
    });

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CookieService, useValue: mockCookieService },
        { provide: Router, useValue: mockRouter },
      ]
    });
    guard = TestBed.inject(AuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should have authTokenName equals to "auth_token"', () => {
    const result: string = guard.authTokenName;
    expect(result).toEqual(expectedTokenName);
  });

  it('should return true to allow access, canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)', () => {
    mockCookieService.check.and.returnValue(true); // El servicio CookieService retorna true en el metodo check
    const mockData = { router: {} as ActivatedRouteSnapshot, state: {} as RouterStateSnapshot };
    const result = guard.canActivate( mockData.router, mockData.state );
    expect(result).toBeTruthy();
    expect(mockCookieService.check).toHaveBeenCalledOnceWith(expectedTokenName);
  });
  
  it('should return false to deny access and navigate to login url, canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)', () => {
    mockCookieService.check.and.returnValue(false); // El servicio CookieService retorna false en el metodo check
    const mockData = { router: {} as ActivatedRouteSnapshot, state: { url: 'testURL' } as RouterStateSnapshot };
    const result = guard.canActivate(mockData.router, mockData.state );
    expect(result).toBeFalsy();
    expect(mockCookieService.check).toHaveBeenCalledOnceWith(expectedTokenName);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login/'], { queryParams: { next: 'testURL' } });
  });
});
