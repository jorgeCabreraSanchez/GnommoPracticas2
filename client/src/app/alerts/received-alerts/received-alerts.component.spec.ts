import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedAlertsComponent } from './received-alerts.component';

describe('ReceivedAlertsComponent', () => {
  let component: ReceivedAlertsComponent;
  let fixture: ComponentFixture<ReceivedAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
