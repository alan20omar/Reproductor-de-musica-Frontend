import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { EditSongComponent } from './components/edit-song/edit-song.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
// Angular matrial
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ScrollDownPipe } from './pipes/scroll-down.pipe';
import { SetImageDirective } from './directives/set-image.directive';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavbarComponent,
    EditSongComponent,
    ProgressBarComponent,
    SetImageDirective,
    ScrollDownPipe,
    ErrorPageComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    // Angular Material
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
  ],
  exports: [
    NavbarComponent,
    EditSongComponent,
    ProgressBarComponent,
    ErrorPageComponent,
    SetImageDirective,
    ScrollDownPipe,
  ]
})
export class SharedModule { }
