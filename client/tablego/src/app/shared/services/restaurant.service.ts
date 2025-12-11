import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../model/Restaurant';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<any> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants`);
  }

  getRestaurantById(id: string) {
    return this.http.get<Restaurant>(`${this.apiUrl}/restaurants/${id}`);
  }

  create(restaurant: Restaurant) {
    return this.http.post(`${this.apiUrl}/createRestaurant`, restaurant, {withCredentials: true});
  }

  update(restaurant: Restaurant) {
    return this.http.put(`${this.apiUrl}/updateRestaurant`, restaurant, {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/deleteRestaurant?id=${id}`, {withCredentials: true});
  }
}
