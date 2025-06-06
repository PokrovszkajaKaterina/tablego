import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantInfoComponent } from 'src/app/restaurant/restaurant-info/restaurant-info.component';

describe('RestaurantInfoComponent', () => {
  let component: RestaurantInfoComponent;
  let fixture: ComponentFixture<RestaurantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
