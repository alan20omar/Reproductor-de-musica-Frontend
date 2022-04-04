import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MusicRoutingModule } from './music-routing.module';
import { SongComponent } from './song/song.component';
import { AlbumComponent } from './album/album.component';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

import { SongsFilterPipe } from './shared/pipes/songs-filter.pipe';

import { SharedModule } from '../shared/shared.module';
import { SongListComponent } from './shared/components/song-list/song-list.component';
import { AlbumArtistGenreFilterPipe } from './shared/pipes/album-artist-genre-filter.pipe';
import { SongsAttrFilterPipe } from './shared/pipes/songs-attr-filter.pipe';
import { MusicComponent } from './music.component';
import { PlayerModule } from '../player/player.module';

@NgModule({
  declarations: [
    SongComponent,
    AlbumComponent,
    SongsFilterPipe,
    SongListComponent,
    AlbumArtistGenreFilterPipe,
    SongsAttrFilterPipe,
    MusicComponent,
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MusicRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    PlayerModule,
    // Angular Material
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
  ],
  exports: []
})
export class MusicModule { }
