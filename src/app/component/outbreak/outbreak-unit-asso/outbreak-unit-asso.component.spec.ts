import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutbreakUnitAssoComponent } from './outbreak-unit-asso.component';

describe('OutbreakUnitAssoComponent', () => {
  let component: OutbreakUnitAssoComponent;
  let fixture: ComponentFixture<OutbreakUnitAssoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutbreakUnitAssoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutbreakUnitAssoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
