import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player/player.component';
import { PlayQueueComponent } from './play-queue/play-queue.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongsFilterPipe } from './pipes/songs-filter.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    PlayerComponent,
    PlayQueueComponent,
    SongsFilterPipe,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    // Angular Materials
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
  exports: [
    PlayQueueComponent
  ]
})
export class PlayerModule { }
