import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutbreakConfigUnitAssoComponent } from './outbreak-config-unit-asso.component';

describe('OutbreakConfigUnitAssoComponent', () => {
  let component: OutbreakConfigUnitAssoComponent;
  let fixture: ComponentFixture<OutbreakConfigUnitAssoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutbreakConfigUnitAssoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutbreakConfigUnitAssoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
