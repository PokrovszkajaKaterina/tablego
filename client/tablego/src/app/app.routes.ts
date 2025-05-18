import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./restaurant/restaurant-list/restaurant-list.component').then((c) => c.RestaurantListComponent) },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent), canActivate: [authGuard] },
    { path: 'restaurant-info/:_id', loadComponent: () => import('./restaurant/restaurant-info/restaurant-info.component').then((c) => c.RestaurantInfoComponent) },
    { path: 'restaurant-management', loadComponent: () => import('./restaurant/restaurant-management/restaurant-management.component').then((c) => c.RestaurantManagementComponent), canActivate: [authGuard] },
    { path: 'reservation-management', loadComponent: () => import('./reservation-management/reservation-management.component').then((c) => c.ReservationManagementComponent), canActivate: [authGuard]},
    { path: 'reservation-list', loadComponent: () => import('./reservation-list/reservation-list.component').then((c) => c.ReservationListComponent), canActivate: [authGuard]},
    { path: '**', redirectTo: 'home' }
];
