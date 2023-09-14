import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingAnimComponent } from './processing-anim.component';

describe('ProcessingAnimComponent', () => {
  let component: ProcessingAnimComponent;
  let fixture: ComponentFixture<ProcessingAnimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingAnimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingAnimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
