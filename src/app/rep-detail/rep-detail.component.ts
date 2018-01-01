import { Component, OnInit, Input } from '@angular/core';

import { Legislator } from '../data/congress';



@Component({
  selector: 'app-rep-detail',
  templateUrl: './rep-detail.component.html',
  styleUrls: ['./rep-detail.component.scss']
})
export class RepDetailComponent implements OnInit {

  public socialMedia = [
    { icon: 'twitter', urlGetter: 'twitterUrl' },
    { icon: 'facebook', urlGetter: 'facebookUrl' },
    { icon: 'youtube', urlGetter: 'youtubeChannelUrl' },
    { icon: 'instagram', urlGetter: 'instagramUrl' },
  ];

  @Input()
  rep: Legislator;

  constructor() { }

  ngOnInit() {
  }

}
