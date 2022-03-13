import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';

const routes: Routes = [
  { path: '', children: [
    { path: 'create-acount', component: CrearCuentaComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
