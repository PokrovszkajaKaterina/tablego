import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantManagementComponent } from 'src/app/restaurant/restaurant-management/restaurant-management.component';

describe('RestaurantManagementComponent', () => {
  let component: RestaurantManagementComponent;
  let fixture: ComponentFixture<RestaurantManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
