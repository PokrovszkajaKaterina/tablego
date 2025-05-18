import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../model/Restaurant';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<any> {
    return this.http.get<Restaurant[]>('http://localhost:5000/app/restaurants');
  }

  getRestaurantById(id: string) {
    return this.http.get<Restaurant>(`http://localhost:5000/app/restaurants/${id}`);
  }

  create(restaurant: Restaurant) {
    return this.http.post('http://localhost:5000/app/createRestaurant', restaurant, {withCredentials: true});
  }

  update(restaurant: Restaurant) {
    return this.http.put('http://localhost:5000/app/updateRestaurant', restaurant, {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://localhost:5000/app/deleteRestaurant?id=' + id, {withCredentials: true});
  }
}
