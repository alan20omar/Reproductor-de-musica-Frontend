import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import LoginUserModel from 'src/app/models/loginUser';
import { AuthService } from 'src/app/services/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  let mockAuthService: jasmine.SpyObj<AuthService>;
  // let spy_isLoggedIn: jasmine.Spy<() => Observable<boolean>>;
  // let spy_navigate: jasmine.Spy<any>;
  
  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['loginUser']);
    
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
        { provide: AuthService, useValue: mockAuthService },
      ]
    })
    .compileComponents();
    // mockRouter = TestBed.inject(Router);
    // spy_navigate = spyOn(mockRouter, 'navigate');
    // spy_isLoggedIn = (Object.getOwnPropertyDescriptor(mockAuthService, 'isLoggedIn')?.get as jasmine.Spy<() => Observable<boolean>>).and.returnValue(of(true));
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    expect(component.loginForm).toBeTruthy();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should activate error email validator', () => {
    const mockData = { email: 'erroneo.email.com', password: 'pass' };
    const emailInput: HTMLInputElement = fixture.debugElement.query(By.css('[formControlName="email"]')).nativeElement;
    const passwordInput: HTMLInputElement = fixture.debugElement.query(By.css('[formControlName="password"]')).nativeElement;
    emailInput.value = mockData.email;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = mockData.password;
    passwordInput.dispatchEvent(new Event('input'));
    const result: boolean = component.loginForm.get('email')?.errors?.['email'];
    const result2: boolean | undefined = component.loginForm.get('email')?.errors?.['required'];
    const result3: boolean | undefined = component.loginForm.get('password')?.errors?.['required'];
    expect(result).toBeTrue();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
  });

  it('should throw a alert of invalid form, login()', () => {
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', {});
    const result: boolean = component.loginForm.valid;
    expect(result).toBeFalse();
    expect(mockAuthService.loginUser).not.toHaveBeenCalled();
  });

  it('should send data for login to authService', () =>{
    mockAuthService.loginUser.and.returnValue(undefined);
    const mockData: LoginUserModel = { email: 'test@test.com', password: 'passTest' };
    const form = fixture.debugElement.query(By.css('form'));
    const emailInput: HTMLInputElement = fixture.debugElement.query(By.css('[formControlName="email"]')).nativeElement;
    const passwordInput: HTMLInputElement = fixture.debugElement.query(By.css('[formControlName="password"]')).nativeElement;
    emailInput.value = mockData.email;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = mockData.password;
    passwordInput.dispatchEvent(new Event('input'));
    form.triggerEventHandler('submit', {});
    const result: boolean = component.loginForm.valid;
    expect(result).toBeTrue();
    expect(mockAuthService.loginUser).toHaveBeenCalledOnceWith({ email: 'test@test.com', password: 'passTest' });
  });

  it('should return undefined due to invalid key and type, getError(key: string, type: string): boolean|undefined', () => {
    const mockData = {key: 'testKey', type: 'testType'};
    const expectedResult = undefined;
    const result = component.getError(mockData.key, mockData.type);
    expect(result).toBe(expectedResult);
  });

});
