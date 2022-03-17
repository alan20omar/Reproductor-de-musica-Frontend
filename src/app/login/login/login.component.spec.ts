import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import UserModel from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  let message: any;
  let user: UserModel;
  let fakeAuthService: AuthService;

  beforeEach(async () => {
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', {
      patchUser: of(message),
      getUser: of(user),
    });

    await TestBed.configureTestingModule({
      declarations: [ 
        LoginComponent,
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: fakeAuthService },

      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
