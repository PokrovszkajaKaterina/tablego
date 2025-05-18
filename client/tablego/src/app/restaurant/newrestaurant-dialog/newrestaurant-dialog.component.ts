import { Component } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-newrestaurant-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './newrestaurant-dialog.component.html',
  styleUrl: './newrestaurant-dialog.component.scss'
})
export class NewrestaurantDialogComponent {
  restaurantForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NewrestaurantDialogComponent>) {
    this.restaurantForm = this.fb.group({
      name: [''],
      address: [''],
      email: [''],
      phone: [''],
      description: [''],
      about: [''],
      maxCapacity: [0]
    });
  }

  onSubmit() {
    if (!this.restaurantForm.valid) return;

    const restaurantData = this.restaurantForm.value;
    this.dialogRef.close(restaurantData);
  }
}
