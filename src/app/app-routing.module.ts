import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './album/album.component';
import { SongComponent } from './song/song.component';

const routes: Routes = [
  {path: '', redirectTo: 'song/', pathMatch: 'full'},
  {path: 'song', component: SongComponent},
  {path: 'song/:songId', component: SongComponent},
  {path: 'album', component: AlbumComponent},
  {path: 'album/:songId', component: AlbumComponent},
  {path: 'artist', component: SongComponent},
  {path: 'artist/:songId', component: SongComponent},
  {path: 'genre', component: SongComponent},
  {path: 'genre/:songId', component: SongComponent},
  {path: '**', redirectTo: 'song/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
