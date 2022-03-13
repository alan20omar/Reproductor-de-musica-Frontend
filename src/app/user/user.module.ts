import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';

import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CrearCuentaComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    // Angular Material
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
  ],
  exports: []
})
export class UserModule { }
