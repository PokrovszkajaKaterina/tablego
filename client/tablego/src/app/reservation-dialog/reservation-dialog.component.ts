import { Component, Inject } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';

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
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatError,
    MatDatepickerToggle,
    MatDatepicker,
    FormsModule,
    MatDatepickerInput,
    MatDialogClose,
    NgIf,
    MatInput,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    MatNativeDateModule,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
    { provide: MAT_DATE_FORMATS, useValue: HUNGARIAN_DATE_FORMATS }
  ],
  templateUrl: './reservation-dialog.component.html',
  styleUrl: './reservation-dialog.component.scss'
})
export class ReservationDialogComponent {
  reservationForm: FormGroup;

  numberOfPeople: number = 0;
  today: Date = new Date();
  selectedTime: Date | null = null;
  selectedHour: number | null = null;
  selectedMinute: number | null = null;
  maxCapacity: number;
  minSelectableHour!: number;
  disableHourInput = false;
  disableMinuteInput = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { restaurant: { id: string, maxCapacity: number } }
  ) {
    this.reservationForm = this.fb.group({
      restaurantId: this.data.restaurant.id,
      numberOfPeople: [0],
      selectedTime: [''],
      selectedHour: [''],
      selectedMinute: [''],
      comment: [''],
    });
    this.maxCapacity = data.restaurant?.maxCapacity ?? 1;
  }

  ngOnInit() {
    const now = new Date();
    this.minSelectableHour = now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();
    if (this.selectedTime && this.selectedTime.toDateString() === now.toDateString()) {
      this.disableMinuteInput = true;
    } else {
      this.disableMinuteInput = false;
    }
  }

  onSubmit() {
    if (!this.reservationForm.valid) return;

    this.dialogRef.close(this.reservationForm);
  }

}
