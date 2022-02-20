import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingInfectiousStatusComponent } from './listing-infectious-status.component';

describe('ListingInfectiousStatusComponent', () => {
  let component: ListingInfectiousStatusComponent;
  let fixture: ComponentFixture<ListingInfectiousStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingInfectiousStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingInfectiousStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
