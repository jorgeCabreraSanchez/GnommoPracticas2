import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentAlertsComponent } from './sent-alerts.component';

describe('SentAlertsComponent', () => {
  let component: SentAlertsComponent;
  let fixture: ComponentFixture<SentAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
