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
      'https://loremflickr.com/320/240',
      149.99
    ),
    new Place(
      'p2',
      'Lamour Toujours',
      'A romantic place in Paris',
      'https://loremflickr.com/320/240',
      189.99
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://loremflickr.com/320/240',
      99.99
    ),
  ];

  constructor() { }

  get places() {
    return [...this._places];
  }
}// cs
