import { Component } from '@angular/core';
import { KeyValuePipe, NgForOf, NgIf, TitleCasePipe } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { Restaurant, OpeningHour } from '../../shared/model/Restaurant';
import { MatIcon } from "@angular/material/icon";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-restaurant-info',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    KeyValuePipe,
    MatIcon,
    TitleCasePipe,
    MatDivider
  ],
  templateUrl: './restaurant-info.component.html',
  styleUrl: './restaurant-info.component.scss'
})
export class RestaurantInfoComponent {
  restaurantId: string | null = null;
  restaurant: Restaurant | null = null;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService) {
  }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('_id');
    if (this.restaurantId) {
      this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
        next: (data) => {
          this.restaurant = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  asArray(value: OpeningHour | OpeningHour[]): OpeningHour[] {
    return Array.isArray(value) ? value : [value];
  }

  asSingleHour(value: OpeningHour | OpeningHour[] | null): OpeningHour | null {
    return Array.isArray(value) ? null : value;
  }

  hasValidTimeArray(arr: any[]): boolean {
    return Array.isArray(arr) && arr.some(t => t?.open && t?.close);
  }

  dayOrder: string[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];

  dayTranslations: { [key: string]: string } = {
    monday: 'Hétfő',
    tuesday: 'Kedd',
    wednesday: 'Szerda',
    thursday: 'Csütörtök',
    friday: 'Péntek',
    saturday: 'Szombat',
    sunday: 'Vasárnap'
  };

  translateDay(day: string): string {
    return this.dayTranslations[day.toLowerCase()] || day;
  }

  getSortedOpeningHours(openingHours: { [key: string]: any }) {
    return Object.entries(openingHours)
      .sort(([a], [b]) => this.dayOrder.indexOf(a) - this.dayOrder.indexOf(b))
      .map(([key, value]) => ({ key, value }));
  }
}
