import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAttrListComponent } from './card-attr-list.component';

describe('CardAttrListComponent', () => {
  let component: CardAttrListComponent;
  let fixture: ComponentFixture<CardAttrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAttrListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAttrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
