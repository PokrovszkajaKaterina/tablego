import { Component } from '@angular/core';
import { ReservationService } from '../shared/services/reservation.service';
import { AuthService } from '../shared/services/auth.service';
import { Reservation } from '../shared/model/Reservation';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";
import { DatePipe, NgIf } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatSuffix } from "@angular/material/form-field";
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDivider } from "@angular/material/divider";

export const HUNGARIAN_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY.MM.DD',
  },
  display: {
    dateInput: 'YYYY.MM.DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM',
  },
};

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    MatTooltip,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatHeaderCellDef,
    MatDialogModule,
    DatePipe,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatNativeDateModule,
    MatDatepickerInput,
    MatDivider
  ],
  providers: [
    MatNativeDateModule,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
    { provide: MAT_DATE_FORMATS, useValue: HUNGARIAN_DATE_FORMATS }
  ],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss'
})
export class ReservationListComponent {
  userId: string | null = null;
  columns = ['name', 'date', 'time', 'numberOfPeople', 'status', 'actions'];
  pastColumns = ['name', 'date', 'time', 'numberOfPeople'];
  reservations!: Reservation[];
  editingRowIndex: number | null = null;
  today = new Date();
  minSelectableHour!: number;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.userId = this.authService.getUserId();
  }

  ngOnInit(): void {
    const now = new Date();
    this.minSelectableHour = now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();

    if (this.userId) {
      this.reservationService.getReservationsByUserId(this.userId).subscribe({
        next: (data) => {
          this.reservations = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  statusTranslations: { [key: string]: string } = {
    pending: 'Függőben',
    confirmed: 'Megerősítve',
    cancelled: 'Lemondva',
  };

  translateStatus(status: string): string {
    return this.statusTranslations[status?.toLowerCase()] || status;
  }

  startEdit(index: number) {
    this.editingRowIndex = index;
  }

  cancelEdit() {
    if (this.userId) {
      this.reservationService.getReservationsByUserId(this.userId).subscribe({
        next: (data) => {
          this.reservations = data;
          this.editingRowIndex = null;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  saveEdit(reservation: Reservation, n: number) {
    if (!reservation._id && this.reservations[n]?._id) {
      reservation._id = this.reservations[n]._id;
    }

    this.reservationService.editReservation(reservation).subscribe({
      next: () => {
        this.openSnackBar('Foglalás módosítása sikeresen megtörtént.', 3000);
        this.editingRowIndex = null;
      }, error: (err) => {
        console.log(err);
        this.openSnackBar('Hiba történt a módosítás során!', 3000);
      }
    });
  }

  deleteReservation(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {message: 'Biztosan szeretné törölni a foglalást?'}
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.reservationService.deleteReservation(id).subscribe({
            next: () => {
              this.reservations?.splice(n, 1);
              this.reservations = [...this.reservations];
              this.openSnackBar('Foglalás törlése sikeresen megtörtént.', 3000);
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
    this.snackBar.open(message, undefined, {duration: duration});
  }

  isPastTime(reservation: Reservation): boolean {
    const reservationDate = new Date(reservation.date);
    if (reservation.time) {
      const { hour: hours, minute: minutes } = reservation.time;
      reservationDate.setHours(hours, minutes, 0, 0);
    }
    return reservationDate < new Date();
  }

  isActiveReservationInArray(): boolean {
    return this.reservations.some(reservation => {
      return !this.isPastTime(reservation);
    });
  }
}
