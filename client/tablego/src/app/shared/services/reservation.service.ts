import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createReservation(reservation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createReservation`, reservation, {withCredentials: true});
  }

  getReservations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getReservations`, {withCredentials: true});
  }

  getReservationsByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getReservationsByUserId/${userId}`, {withCredentials: true});
  }

  updateReservationStatus(reservationId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateReservationStatus`, {_id: reservationId, status}, {withCredentials: true});
  }

  editReservation(reservation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateReservation`, reservation, {withCredentials: true});
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteReservation/${id}`, {withCredentials: true});
  }

}
