import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LoginUserModel from 'src/app/models/loginUser';
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
  ) { }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  getError(key: string, type: string): boolean|undefined {
    return this.loginForm.get(key)?.errors?.[type];
  }

  login(){
    if (!this.loginForm.valid) {
      alert('No se aceptan campos invalidos');
      return;
    }
    const data: LoginUserModel = { 
      email: this.loginForm.value['email'], 
      password: this.loginForm.value['password']
    }
    this.authService.loginUser(data);
  }

  ngOnDestroy() { }
}
