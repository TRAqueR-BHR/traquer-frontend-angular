import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectiousStatusHistoryComponent } from './infectious-status-history.component';

describe('InfectiousStatusHistoryComponent', () => {
  let component: InfectiousStatusHistoryComponent;
  let fixture: ComponentFixture<InfectiousStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfectiousStatusHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectiousStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
