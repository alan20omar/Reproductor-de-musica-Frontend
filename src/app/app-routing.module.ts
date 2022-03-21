import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './helpers/auth-guard.guard';
import { LoginGuard } from './helpers/login.guard';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginModule ), canLoad: [LoginGuard] },
  { path: 'user', loadChildren: () => import('./user/user.module').then( m => m.UserModule ), },
  { path: '', loadChildren: () => import('./music/music.module').then( m => m.MusicModule ), canActivate: [AuthGuardGuard] },
  { path: '**', redirectTo: 'song', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
