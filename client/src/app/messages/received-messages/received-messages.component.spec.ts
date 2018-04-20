import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedMessagesComponent } from './received-messages.component';

describe('ReceivedMessagesComponent', () => {
  let component: ReceivedMessagesComponent;
  let fixture: ComponentFixture<ReceivedMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
