import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../shared/model/User';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconButton } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatIconButton, MatTooltip, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users!: User[];
  columns = ['name', 'nickname', 'address', 'email', 'actions'];
  editingRowIndex: number | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      }, error: (err) => {
        console.log(err);
        this.openSnackBar('Hiba történt a felhasználók lekérdezése során!.', 3000);
      }
    });
  }

  startEdit(index: number) {
    this.editingRowIndex = index;
  }

  cancelEdit() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.editingRowIndex = null;
      },
      error: (err) => {
        console.log(err);
        this.editingRowIndex = null;
      }
    });
  }

  saveUser(user: User, n: number) {
      this.userService.update(user).subscribe({
      next: () => {
        this.users[n] = user;
        this.users = [...this.users];
        this.editingRowIndex = null;
        this.openSnackBar('Felhasználó módosítása sikeresen megtörtént.', 3000);
      }, error: (err) => {
        console.log(err);
        this.openSnackBar('Hiba történt a felhasználó módosítása során!', 3000);
      }
    });
  }

  deleteUser(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: 'Biztosan szeretné törölni a felhasználót?' }
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.userService.delete(id).subscribe({
            next: () => {
              this.users?.splice(n, 1);
              this.users = [...this.users];
              this.openSnackBar('Felhasználó törlése sikeresen megtörtént.', 3000);
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
