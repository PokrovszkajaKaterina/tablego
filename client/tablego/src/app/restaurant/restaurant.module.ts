import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantInfoComponent } from './restaurant-info/restaurant-info.component';
import { RestaurantManagementComponent } from './restaurant-management/restaurant-management.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RestaurantListComponent,
    RestaurantInfoComponent,
    RestaurantManagementComponent
  ]
})
export class RestaurantModule { }
