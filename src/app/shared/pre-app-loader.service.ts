import { Injectable } from '@angular/core';

@Injectable()
export class PreAppLoaderService {

  constructor() { }

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
