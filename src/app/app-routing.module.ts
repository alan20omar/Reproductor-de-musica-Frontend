import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './helpers/auth-guard.guard';
import { LoginGuard } from './helpers/login.guard';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginModule ), canLoad: [LoginGuard] },
  { path: 'user', loadChildren: () => import('./user/user.module').then( m => m.UserModule ), },
  { path: 'music', loadChildren: () => import('./music/music.module').then( m => m.MusicModule ), canActivate: [AuthGuardGuard] },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
