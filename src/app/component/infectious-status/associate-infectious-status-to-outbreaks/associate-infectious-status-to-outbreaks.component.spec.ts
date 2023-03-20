import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateInfectiousStatusToOutbreaksComponent } from './associate-infectious-status-to-outbreaks.component';

describe('AssociateInfectiousStatusToOutbreaksComponent', () => {
  let component: AssociateInfectiousStatusToOutbreaksComponent;
  let fixture: ComponentFixture<AssociateInfectiousStatusToOutbreaksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociateInfectiousStatusToOutbreaksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateInfectiousStatusToOutbreaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
