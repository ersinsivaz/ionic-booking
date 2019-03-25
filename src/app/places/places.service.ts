import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan mansion',
      'In the heart of the New York city',
      'https://loremflickr.com/320/240?random=1',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Lamour Toujours',
      'A romantic place in Paris',
      'https://loremflickr.com/320/240?random=2',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://loremflickr.com/320/240?random=3',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
  ]) ;

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http
    .get<{[key: string]: PlaceData}>('https://pepper-d2151.firebaseio.com/offered-places.json')
    .pipe(map(resData => {
      const places = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          places.push(
            new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId
            )
          );
        }
      }
      return places;
    }), tap(places => {
      this._places.next(places);
    }));
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }));
  }

  addPlace(title: string, description: string,
          price: number,
          dateFrom: Date,
          dateTo: Date) {
            let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://loremflickr.com/320/240?random=4',
      price,
      dateFrom,
      dateTo,
      this.authService.userId);

      return this.http.post<{name: string}>('https://pepper-d2151.firebaseio.com/offered-places.json', {...newPlace, id: null})
        .pipe(
          switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
        );

      /* return this.places.pipe(take(1), delay(3000), tap(places => {
        this._places.next(places.concat(newPlace));
      })); */
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(take(1), delay(3000), tap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      return updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId);
    }));
  }
}// cs
