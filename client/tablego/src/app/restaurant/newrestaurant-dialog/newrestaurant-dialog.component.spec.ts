import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewrestaurantDialogComponent } from './newrestaurant-dialog.component';

describe('NewrestaurantDialogComponent', () => {
  let component: NewrestaurantDialogComponent;
  let fixture: ComponentFixture<NewrestaurantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewrestaurantDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewrestaurantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
