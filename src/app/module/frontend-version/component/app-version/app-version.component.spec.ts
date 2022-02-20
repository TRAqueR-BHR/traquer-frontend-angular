import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppVersionComponent } from './app-version.component';

describe('AppVersionComponent', () => {
  let component: AppVersionComponent;
  let fixture: ComponentFixture<AppVersionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
