import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '../helpers/auth-guard.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: '', children: [
    {path: '', component: LoginComponent},
    // {path: 'logout', component: LoginComponent, canActivate: [AuthGuardGuard] },
    {path: '**', redirectTo: 'error'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
