import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan mansion',
      'In the heart of the New York city',
      'https://loremflickr.com/320/240?random=1',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31')
    ),
    new Place(
      'p2',
      'Lamour Toujours',
      'A romantic place in Paris',
      'https://loremflickr.com/320/240?random=2',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31')
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://loremflickr.com/320/240?random=3',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31')
    ),
  ];

  constructor() { }

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}// cs
