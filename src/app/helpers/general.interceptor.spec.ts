import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

import { GeneralInterceptor } from './general.interceptor';

describe('GeneralInterceptor', () => {
  let interceptor: GeneralInterceptor;
  let http: HttpClient;
  let mockHttp: HttpTestingController;

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCookieService: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', {
      logout: undefined,
    });
    mockCookieService = jasmine.createSpyObj<CookieService>('CookieService', ['get']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        GeneralInterceptor,
        { provide: HTTP_INTERCEPTORS, useClass: GeneralInterceptor, multi: true },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CookieService, useValue: mockCookieService }
      ]
    });
    interceptor = TestBed.inject(GeneralInterceptor);
    http = TestBed.inject(HttpClient);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add an authorization header', () => {
    mockCookieService.get.and.returnValue('tokenTest'); // El servicio CookieService retorna un token
    const expectedResult: string = 'Bearer tokenTest';
    http.get('/test').subscribe({
      next: (res) => {
        expect(res).toBeTruthy();
      }
    });
    const httpReq = mockHttp.expectOne('/test');
    const result: string|null = httpReq.request.headers.get('authorization');
    expect(mockCookieService.get).toHaveBeenCalled();
    expect(result).toBe(expectedResult);
  });

  it('should not add an authorization header', () => {
    mockCookieService.get.and.returnValue(''); // El servicio CookieService retorna una cadena vacia
    http.get('/test').subscribe({
      next: (res) => {
        expect(res).toBeTruthy();
      }
    });
    const httpReq = mockHttp.expectOne('/test');
    const result: string|null = httpReq.request.headers.get('authorization');
    expect(mockCookieService.get).toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('should catch 403 http error and logout', () => {
    mockCookieService.get.and.returnValue('irrelevant token'); // El servicio CookieService retorna un token
    const mockResponseErrorData = { status: 403, statusText: 'Forbidden', mensaje: 'Token inválida' };
    http.get('/test').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      }
    });
    mockHttp.expectOne('/test').flush({}, mockResponseErrorData);
    expect(mockCookieService.get).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
