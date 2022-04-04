import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {
  authTokenName = 'auth_token';
  constructor(
    private cookieService: CookieService,
    private router: Router,
  ){ }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authToken: boolean = this.cookieService.check(this.authTokenName);
    if (authToken) {
      this.router.navigate(['music','song','id']);
      alert('Ya existe una sessión activa');
      return false;
    }
    return true;
  }
}
