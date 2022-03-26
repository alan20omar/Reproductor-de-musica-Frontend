import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerComponent } from './player/player.component';
import { PlayQueueComponent } from './play-queue/play-queue.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Angular material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

import { SongsFilterPipe } from './pipes/songs-filter.pipe';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PlayerComponent,
    PlayQueueComponent,
    SongsFilterPipe,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    SharedModule,
    // Angular Materials
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
  exports: [
    PlayQueueComponent
  ]
})
export class PlayerModule { }
