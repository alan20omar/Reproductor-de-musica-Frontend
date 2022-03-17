import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GeneralInterceptor implements HttpInterceptor {

  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.cookieService.get('auth_token');
    // console.log(token)
    let req = request;
    if (token){
      req = request.clone({
        // headers: request.headers.set('X-CSRFToken', xsrfToken),
        withCredentials: true,
        // headers: request.headers.set('Authorization', `bearer ${token}`)
        setHeaders: {
          authorization: `Bearer ${token}`
        },
      });
      console.log('hola desde intercept');
    }
    
    return next.handle(req).pipe(
      tap(() => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse){
            if (err.status !== 401 && err.status !== 500){
              if (err.status === 403){
                this.authService.logout();
              }
              return;
            }
            // funcion Cerrar sesion
            // router naveagate home
          }
        }
      )
    );
  }

}