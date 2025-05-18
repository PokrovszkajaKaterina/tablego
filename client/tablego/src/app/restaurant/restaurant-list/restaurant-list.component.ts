import { Component } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { RestaurantService } from '../../shared/services/restaurant.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { AuthService } from '../../shared/services/auth.service';
import { Restaurant } from '../../shared/model/Restaurant';
import { NgForOf, NgIf } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ReservationDialogComponent } from "../../reservation-dialog/reservation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatIcon,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.scss'
})
export class RestaurantListComponent {
  restaurants!: Restaurant[];

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private reservationService: ReservationService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  openReservationDialog(restaurant: any): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '400px',
      data: {restaurant: restaurant}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reservationData = result.value;
        reservationData.userId = this.authService.getUserId();
        reservationData.date = reservationData.selectedTime;
        reservationData.time = {
          hour: reservationData.selectedHour,
          minute: reservationData.selectedMinute
        };

        delete reservationData.selectedHour;
        delete reservationData.selectedMinute;

        this.reservationService.createReservation(reservationData).subscribe({
          next: (data) => {
            this.openSnackBar('Sikeres asztalfoglalás!', 3000);
          },
          error: (err) => {
            console.error('Hiba történt asztalfoglalás során:', err);
          }
        });
      }
    });
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, { duration: duration });
  }
}
