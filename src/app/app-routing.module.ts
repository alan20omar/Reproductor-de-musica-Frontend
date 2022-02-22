import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './album/album.component';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { AuthGuardGuard } from './helpers/auth-guard.guard';
import { LoginComponent } from './login/login.component';
import { SongComponent } from './song/song.component';

const routes: Routes = [
  {path: '', redirectTo: 'song/', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'login/create-acount', component: CrearCuentaComponent},
  {path: 'song', component: SongComponent, canActivate: [AuthGuardGuard]},
  {path: 'song/:songId', component: SongComponent, canActivate: [AuthGuardGuard]},
  {path: 'album', component: AlbumComponent, canActivate: [AuthGuardGuard]},
  {path: 'album/:songId', component: AlbumComponent, canActivate: [AuthGuardGuard]},
  {path: 'artist', component: SongComponent, canActivate: [AuthGuardGuard]},
  {path: 'artist/:songId', component: SongComponent, canActivate: [AuthGuardGuard]},
  {path: 'genre', component: SongComponent, canActivate: [AuthGuardGuard]},
  {path: 'genre/:songId', component: SongComponent, canActivate: [AuthGuardGuard]},
  {path: '**', redirectTo: 'song/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
