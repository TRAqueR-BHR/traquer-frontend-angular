import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectiousStatusEditComponent } from './infectious-status-edit.component';

describe('InfectiousStatusEditComponent', () => {
  let component: InfectiousStatusEditComponent;
  let fixture: ComponentFixture<InfectiousStatusEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfectiousStatusEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectiousStatusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
