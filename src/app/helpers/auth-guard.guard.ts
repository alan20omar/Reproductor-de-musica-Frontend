import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  authTokenName = 'auth_token';
  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authToken: boolean = this.cookieService.check(this.authTokenName);
    if (!authToken){
      const url = state.url;
      // console.log(url)
      return this.router.navigate(['/login/'], { queryParams: { next: url } });
    }else{
      return true;
    }
  }
  
}
