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
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Componentes
import { AppComponent } from './app.component';
import { PlayerComponent } from './shared/player/player.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { EditSongComponent } from './shared/edit-song/edit-song.component';
import { ProgressBarComponent } from './shared/progress-bar/progress-bar.component';

import { SongsFilterPipe } from './shared/pipes/songs-filter.pipe';

import { CookieService } from 'ngx-cookie-service';
import { GeneralInterseptorInterceptor } from './helpers/general-interseptor.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    NavbarComponent,
    EditSongComponent,
    ProgressBarComponent,
    SongsFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    // Angular Material
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    // HttpClientXsrfModule.withOptions({ cookieName: 'csrftoken', headerName: 'X-CSRFToken' }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: GeneralInterseptorInterceptor, multi: true }, CookieService],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}