import { Injectable } from '@angular/core';
import {
  Router,
  RouterEvent,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { filter } from 'rxjs/operators';



@Injectable()
export class PreAppLoaderService {

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: RouterEvent) => (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ))
    )
    .subscribe((event: RouterEvent) => {
      this.remove();
    });
  }

  public remove() {
    window.setTimeout(() => this._remove(), 100);
  }

  private _remove() {
    const loader = document.querySelector('#pre-app-loader');
    if (loader) {
      loader.classList.add('removing');
      window.setTimeout(() => loader.remove(), 1200);
    }
  }
}
