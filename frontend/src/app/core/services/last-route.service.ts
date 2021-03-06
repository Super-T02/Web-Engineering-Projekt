import { Injectable } from '@angular/core';
import {UrlSegment} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LastRouteService {

  route: string = '/';
  query: Object = {};

  constructor() {
  }

  /**
   * Filters the url form a array of urlSegments
   * @param urlSegments
   */
  newUrl(urlSegments: UrlSegment[]): void {
    let url = '';
    for (const urlSegment of urlSegments) {
      url += `/${urlSegment.path}`;
    }
    this.route = url;
  }

  /**
   * New Url as String
   * @param url
   */
  newUrlString(url: string): void {
    this.route = url;
  }
}
