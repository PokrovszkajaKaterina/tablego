import { Component } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Restaurant } from '../../shared/model/Restaurant';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { MatTooltip } from '@angular/material/tooltip';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
import { OpeninghourDialogComponent } from '../openinghour-dialog/openinghour-dialog.component';
import { NewrestaurantDialogComponent } from '../newrestaurant-dialog/newrestaurant-dialog.component';

@Component({
  selector: 'app-restaurant-management',
  standalone: true,
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatIcon,
    MatIconButton,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTooltip,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    MatButton,
    MatDialogModule,
    DatePipe
  ],
  templateUrl: './restaurant-management.component.html',
  styleUrl: './restaurant-management.component.scss'
})
export class RestaurantManagementComponent {
  restaurants!: Restaurant[];
  columnsToDisplay = ['name', 'address', 'email', 'phone', 'maxCapacity', 'actions'];
  editingRowIndex: number | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private dialog: MatDialog,
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

  startEdit(index: number) {
    this.editingRowIndex = index;
  }

  cancelEdit() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.editingRowIndex = null;
      },
      error: (err) => {
        console.log(err);
        this.editingRowIndex = null;
      }
    });
  }

  saveRestaurant(restaurant: Restaurant, n: number) {
    this.restaurantService.update(restaurant).subscribe({
      next: () => {
        this.restaurants[n] = restaurant;
        this.restaurants = [...this.restaurants];
        this.editingRowIndex = null;
        this.openSnackBar('Étterem módosítása sikeresen megtörtént.', 3000);
      }, error: (err) => {
        console.log(err);
        this.openSnackBar('Hiba történt a módosítás során!', 3000);
      }
    });
  }

  openAddRestaurantDialog() {
    const dialogRef = this.dialog.open(NewrestaurantDialogComponent, {
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.restaurantService.create(data).subscribe({
            next: (newRestaurant) => {
              this.restaurants.push(newRestaurant as Restaurant);
              this.restaurants = [...this.restaurants];
              this.openSnackBar('Új étterem hozzáadása sikeresen megtörtént.', 3000);
            }, error: (err) => {
              console.log(err);
              this.openSnackBar('Hiba történt az új étterem hozzáadása során!', 3000);
            }
          });
        }
      }, error: (err) => {
        console.log(err);
        this.openSnackBar('Hiba történt az új étterem hozzáadása során!', 3000);
      }
    });
  }

  openOpeningHoursDialog(restaurant: Restaurant) {
    const dialogRef = this.dialog.open(OpeninghourDialogComponent, {
      data: { restaurant: restaurant }
    });

    dialogRef.afterClosed().subscribe(updatedIntervals => {
      if (updatedIntervals) {
        const updatedRestaurant = { ...restaurant, openingHours: updatedIntervals };
        this.restaurantService.update(updatedRestaurant).subscribe({
          next: (res) => {
            Object.assign(restaurant, res);
            this.openSnackBar('Étterem nyitvatartásának frissítése sikeresen megtörtént.', 3000);
          }
        });
      }
    });
  }

  deleteRestaurant(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: 'Biztosan szeretné törölni az éttermet?' }
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.restaurantService.delete(id).subscribe({
            next: () => {
              this.restaurants?.splice(n, 1);
              this.restaurants = [...this.restaurants];
              this.openSnackBar('Étterem törlése sikeresen megtörtént.', 3000);
            }, error: (err) => {
              console.log(err);
              this.openSnackBar('Hiba történt a törlés során!', 3000);
            }
          });
        }
      }, error: (err) => {
        console.log(err);
        this.openSnackBar('Hiba történt a törlés során!', 3000);
      }
    })
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, { duration: duration });
  }
}
