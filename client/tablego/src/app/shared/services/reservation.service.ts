import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  createReservation(reservation: any): Observable<any> {
    return this.http.post('http://localhost:5000/app/createReservation', reservation, {withCredentials: true});
  }

  getReservations(): Observable<any> {
    return this.http.get('http://localhost:5000/app/getReservations', {withCredentials: true});
  }

  getReservationsByUserId(userId: string): Observable<any> {
    return this.http.get(`http://localhost:5000/app/getReservationsByUserId/${userId}`, {withCredentials: true});
  }

  updateReservationStatus(reservationId: string, status: string): Observable<any> {
    return this.http.put(`http://localhost:5000/app/updateReservationStatus`, {_id: reservationId, status}, {withCredentials: true});
  }

  editReservation(reservation: any): Observable<any> {
    return this.http.put('http://localhost:5000/app/updateReservation', reservation, {withCredentials: true});
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/app/deleteReservation/${id}`, {withCredentials: true});
  }

}
