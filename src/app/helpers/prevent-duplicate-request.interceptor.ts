import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { filter, Observable, Subject, tap } from 'rxjs';

@Injectable()
export class PreventDuplicateRequestInterceptor implements HttpInterceptor {
  
  private activeCalls: Map<string, Subject<any>> = new Map();

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo para peticiones GET y DELETE
    if (request.method !== 'GET' && request.method !== 'DELETE') {
      return next.handle(request);
    }
    // console.log('Peticion por prevent duplicate interceptor');
    if (this.activeCalls.has(request.url)) {
      const subject = this.activeCalls.get(request.url);
      if (subject){
        return subject.asObservable();
      }
      throw new Error("Error en la petición");
    }
    this.activeCalls.set(request.url, new Subject<any>());
    return next.handle(request)
      .pipe(
        filter(res => res.type === HttpEventType.Response),
        tap(res => {
          const subject = this.activeCalls.get(request.url);
          if (subject){
            subject.next(res);
            subject.complete();
          }
          this.activeCalls.delete(request.url);
        })
      )
  }
}
