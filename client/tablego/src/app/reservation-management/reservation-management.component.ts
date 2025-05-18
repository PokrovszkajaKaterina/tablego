import { Component } from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatSuffix } from "@angular/material/form-field";
import { MatTooltip } from "@angular/material/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Reservation } from '../shared/model/Reservation';
import { ReservationService } from '../shared/services/reservation.service';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatSuffix,
    MatTable,
    MatTooltip,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatHeaderCellDef
  ],
  templateUrl: './reservation-management.component.html',
  styleUrl: './reservation-management.component.scss'
})
export class ReservationManagementComponent {
  columns = ['name', 'date', 'time', 'numberOfPeople', 'status', 'actions'];
  reservations!: Reservation[];

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  statusTranslations: { [key: string]: string } = {
    pending: 'Függőben',
    confirmed: 'Megerősítve',
    cancelled: 'Lemondva',
  };

  translateStatus(status: string): string {
    return this.statusTranslations[status?.toLowerCase()] || status;
  }

  updateReservationStatus(reservationId: string, status: string): void {
    this.reservationService.updateReservationStatus(reservationId, status).subscribe({
      next: () => {
        this.openSnackBar('Sikeres státusz frissítés!.', 3000);
        this.reservationService.getReservations().subscribe((data) => {
          this.reservations = data;
        });
      },
      error: (err) => {
        console.error(err);
        this.openSnackBar('Hiba státusz frissítése során.', 3000);
      },
    });
  }

  isPastTime(reservation: Reservation): boolean {
    const reservationDate = new Date(reservation.date);
    if (reservation.time) {
      const { hour: hours, minute: minutes } = reservation.time;
      reservationDate.setHours(hours, minutes, 0, 0);
    }
    return reservationDate < new Date();
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
