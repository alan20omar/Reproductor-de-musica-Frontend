import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: string = 'auth_token';

  constructor(
    private api: ApiConfigService,
    private cookieService: CookieService,
    private router: Router,
    private activedRoute: ActivatedRoute
  ) { }

  // Login
  loginUser(form: FormData) {
    this.api.postLogin('login/', form).subscribe({
      next: (data: any) => {
        if (data.token)
          this.cookieService.set(this.authToken, data.token);
        const nextUrl = this.activedRoute.snapshot.queryParamMap.get('next');
        if (nextUrl)
          this.router.navigate([nextUrl]);
        else
          this.router.navigate(['/']);
      },
      error: (error) => {
        alert(error.error);
        // console.error(error.error);
      }
    });
  }

  // LogOut
  logout() {
    this.cookieService.delete(this.authToken);
    if (!this.cookieService.check(this.authToken))
      this.router.navigate(['/login']);
  }

  // Create user
  createUser(form: FormData){
    this.api.postUser('user/', form).subscribe({
      next: (data) => {
        alert(data.mess);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status==409)
          alert('Ya existe una cuenta con ese correo');
        else
          alert('Ocurrio un error. No se pudo crear la cuenta: ' + error.message);
      }
    });
  }
}
