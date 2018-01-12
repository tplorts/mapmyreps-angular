import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public selectedState: any;

  constructor() { }

  ngOnInit() {
    this.selectedState = null;
  }

  public closeState(): void {
    this.selectedState = null;
  }
}
