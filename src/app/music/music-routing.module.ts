import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './album/album.component';
import { SongComponent } from './song/song.component';

const routes: Routes = [
  { path: '', children: [
    // { path: 'song/', component: SongComponent },
    { path: 'song/:songId', component: SongComponent },
    // { path: 'album/', component: AlbumComponent },
    { path: 'album/:songId', component: AlbumComponent },
    // { path: 'artist', component: SongComponent },
    { path: 'artist/:songId', component: SongComponent },
    // { path: 'genre', component: SongComponent },
    { path: 'genre/:songId', component: SongComponent },
    { path: '**', redirectTo: 'error' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicRoutingModule { }
