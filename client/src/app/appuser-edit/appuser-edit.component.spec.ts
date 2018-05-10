import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppuserEditComponent } from './appuser-edit.component';

describe('AppuserEditComponent', () => {
  let component: AppuserEditComponent;
  let fixture: ComponentFixture<AppuserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppuserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppuserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
