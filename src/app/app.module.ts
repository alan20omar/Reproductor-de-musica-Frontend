import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
// Font awasome icons
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// Angular matrial
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Componentes
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { EditSongComponent } from './shared/edit-song/edit-song.component';
import { ProgressBarComponent } from './shared/progress-bar/progress-bar.component';

import { CookieService } from 'ngx-cookie-service';
import { GeneralInterceptor } from './helpers/general.interceptor';
import { PlayerModule } from './player/player.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EditSongComponent,
    ProgressBarComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PlayerModule,
    // Angular Material
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
    // HttpClientXsrfModule.withOptions({ cookieName: 'csrftoken', headerName: 'X-CSRFToken' }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: GeneralInterceptor, multi: true }, CookieService],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}