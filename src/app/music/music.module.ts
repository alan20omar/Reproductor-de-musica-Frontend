import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MusicRoutingModule } from './music-routing.module';
import { SongComponent } from './song/song.component';
import { AlbumComponent } from './album/album.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { SongsFilterPipe } from '../music/pipes/songs-filter.pipe';


@NgModule({
  declarations: [
    SongComponent,
    AlbumComponent,
    SongsFilterPipe,
  ],
  imports: [
    CommonModule,
    MusicRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
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
