import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoverRequestComponent } from './password-recover-request.component';

describe('PasswordRecoverRequestComponent', () => {
  let component: PasswordRecoverRequestComponent;
  let fixture: ComponentFixture<PasswordRecoverRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordRecoverRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRecoverRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
