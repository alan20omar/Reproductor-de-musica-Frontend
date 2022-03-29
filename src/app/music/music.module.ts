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

@NgModule({
  declarations: [
    SongComponent,
    AlbumComponent,
    SongsFilterPipe,
    SongListComponent,
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MusicRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
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
