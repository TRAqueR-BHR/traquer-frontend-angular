import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutbreakEditComponent } from './outbreak-edit.component';

describe('OutbreakEditComponent', () => {
  let component: OutbreakEditComponent;
  let fixture: ComponentFixture<OutbreakEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutbreakEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutbreakEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
