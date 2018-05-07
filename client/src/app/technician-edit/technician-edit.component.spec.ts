import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianEditComponent } from './technician-edit.component';

describe('TechnicianEditComponent', () => {
  let component: TechnicianEditComponent;
  let fixture: ComponentFixture<TechnicianEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicianEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
