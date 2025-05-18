import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatButton, MatIconButton } from "@angular/material/button";
import { Restaurant } from "../../shared/model/Restaurant";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from "@angular/material/input";

@Component({
  selector: 'app-openinghour-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatIcon,
    MatButton,
    MatInput,
    MatFormField,
    MatLabel,
    MatDialogModule,
    MatIconButton
  ],
  templateUrl: './openinghour-dialog.component.html',
  styleUrl: './openinghour-dialog.component.scss'
})
export class OpeninghourDialogComponent {
  openingHoursForm!: FormGroup;

  days = [
    { key: 'monday', label: 'Hétfő' },
    { key: 'tuesday', label: 'Kedd' },
    { key: 'wednesday', label: 'Szerda' },
    { key: 'thursday', label: 'Csütörtök' },
    { key: 'friday', label: 'Péntek' },
    { key: 'saturday', label: 'Szombat' },
    { key: 'sunday', label: 'Vasárnap' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OpeninghourDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { restaurant: Restaurant }
  ) {}

  ngOnInit(): void {
    const group: any = {};
    this.days.forEach(day => {
      const value = this.data.restaurant.openingHours[day.key];
      const intervals = Array.isArray(value) ? value : value ? [value] : [];
      group[day.key] = this.fb.array(
        intervals.map((interval: any) =>
          this.fb.group({
            open: [interval.open],
            close: [interval.close]
          })
        )
      );
    });

    this.openingHoursForm = this.fb.group(group);
  }

  getIntervals(dayKey: string): FormArray {
    return this.openingHoursForm.get(dayKey) as FormArray;
  }

  addInterval(dayKey: string) {
    const intervalGroup = this.fb.group({
      open: [''],
      close: ['']
    });

    this.getIntervals(dayKey).push(intervalGroup);
  }

  removeInterval(dayKey: string, index: number) {
    this.getIntervals(dayKey).removeAt(index);
  }

  saveOpeningHours() {
    if (this.openingHoursForm.invalid) return;

    const updatedOpeningHours = this.openingHoursForm.value;
    this.dialogRef.close(updatedOpeningHours);
  }

}
