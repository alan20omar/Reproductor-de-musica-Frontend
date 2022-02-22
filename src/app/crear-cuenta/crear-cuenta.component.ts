import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss']
})
export class CrearCuentaComponent implements OnInit {
  createAcountForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.createAcountForm = this.formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
  }

  getError(key: string, type: string): boolean {
    return this.createAcountForm.get(key)?.errors?.[type];
  }

  createAcount(){
    if (!this.createAcountForm.valid) {
      alert('No se aceptan campos invalidos');
      return;
    }
    let formData = new FormData();
    formData = this.toFormData(this.createAcountForm.value);
    this.authService.createUser(formData);
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
