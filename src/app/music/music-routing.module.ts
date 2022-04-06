import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './album/album.component';
import { ArtistComponent } from './artist/artist.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { GenreComponent } from './genre/genre.component';
import { MusicComponent } from './music.component';
import { SongComponent } from './song/song.component';

const routes: Routes = [
  { path: '',
  component: MusicComponent,
  children: [
    // { path: 'song/', component: SongComponent },
    { path: 'song/:songId', component: SongComponent },
    // { path: 'album/', component: AlbumComponent },
    { path: 'album/:songId', component: AlbumComponent },
    // { path: 'artist', component: ArtistComponent },
    { path: 'artist/:songId', component: ArtistComponent },
    // { path: 'genre', component: GenreComponent },
    { path: 'genre/:songId', component: GenreComponent },
    // { path: 'favorite', component: FavoriteComponent },
    { path: 'favorite/:songId', component: FavoriteComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicRoutingModule { }
