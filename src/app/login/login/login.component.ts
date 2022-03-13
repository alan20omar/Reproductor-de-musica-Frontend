import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
  ) { 
    const authToken: boolean = this.cookieService.check('auth_token');
    if (authToken){
      this.router.navigate(['/']);
      alert('Ya hay una sesión iniciada');
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  getError(key: string, type: string): boolean{
    return this.loginForm.get(key)?.errors?.[type];
  }

  login(){
    if (!this.loginForm.valid) {
      alert('No se aceptan campos invalidos');
      return;
    }
    let formData = new FormData();
    formData = this.toFormData(this.loginForm.value);
    // formData.append('hola','adios')
    // console.log(formData.values)
    this.authService.loginUser(formData);
  }

  toFormData(formValue: any) {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  }
}
