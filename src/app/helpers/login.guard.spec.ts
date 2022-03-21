import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';

import { LoginGuard } from './login.guard';

describe('LoginGuard', () => {
  let guard: LoginGuard;
  
  let spy_navigate: jasmine.Spy<any>;
  let mockRouter: Router;
  const expectedTokenName: string = 'auth_token';
  let mockCookieService: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    mockCookieService = jasmine.createSpyObj<CookieService>('CookieService', ['check']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: CookieService, useValue: mockCookieService },
      ]
    });
    guard = TestBed.inject(LoginGuard);
    mockRouter = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should have authTokenName equals to "auth_token"', () => {
    const result = guard.authTokenName;
    expect(result).toEqual(expectedTokenName);
  });

  it('should return true to allow access to the login module, canLoad(route: Route, segments: UrlSegment[])', () => {
    spy_navigate = spyOn(mockRouter, 'navigate');
    const mockData = { 
      route: {} as Route, 
      segments: {} as UrlSegment[], 
      CookieService_check_return: false 
    };
    mockCookieService.check.and.returnValue(mockData.CookieService_check_return);
    const result = guard.canLoad(mockData.route, mockData.segments);
    expect(result).toBeTruthy();
    expect(mockCookieService.check).toHaveBeenCalledOnceWith(expectedTokenName);
    expect(spy_navigate).not.toHaveBeenCalled();
  });

  it('should return false to deny access to login module, canLoad(route: Route, segments: UrlSegment[])', () => {
    spy_navigate = spyOn(mockRouter, 'navigate').and.returnValue(new Promise(() => true));
    const mockData = { 
      route: {} as Route, 
      segments: {} as UrlSegment[], 
      CookieService_check_return: true
    };
    mockCookieService.check.and.returnValue(mockData.CookieService_check_return);
    const result = guard.canLoad(mockData.route, mockData.segments);
    expect(result).toBeFalsy();
    expect(mockCookieService.check).toHaveBeenCalledOnceWith(expectedTokenName);
    expect(spy_navigate).toHaveBeenCalledOnceWith(['song']);
  });

});
