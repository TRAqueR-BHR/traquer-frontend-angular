import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectiousStatusExplanationComponent } from './infectious-status-explanation.component';

describe('InfectiousStatusExplanationComponent', () => {
  let component: InfectiousStatusExplanationComponent;
  let fixture: ComponentFixture<InfectiousStatusExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfectiousStatusExplanationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectiousStatusExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
