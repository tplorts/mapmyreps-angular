import { Component, OnInit, Input } from '@angular/core';

import { Legislator, Committee } from '../data/congress';



@Component({
  selector: 'app-rep-detail',
  templateUrl: './rep-detail.component.html',
  styleUrls: ['./rep-detail.component.scss']
})
export class RepDetailComponent implements OnInit {
  private _rep: Legislator;

  public socialMedia = [
    { icon: 'twitter', urlGetter: 'twitterUrl' },
    { icon: 'facebook', urlGetter: 'facebookUrl' },
    { icon: 'youtube', urlGetter: 'youtubeChannelUrl' },
    { icon: 'instagram', urlGetter: 'instagramUrl' },
  ];

  public committeesExpanded: { [thomasId: string]: boolean };

  constructor() { }

  ngOnInit() {
  }

  @Input()
  public set rep(r: Legislator) {
    this.committeesExpanded = {};
    this._rep = r;
  }

  public get rep(): Legislator {
    return this._rep;
  }

  public hasSubs(committee: Committee): boolean {
    const subs = this.rep.subcommittees[committee.thomasId];
    return subs && subs.length > 0;
  }

  public expand(committee: Committee): void {
    this.committeesExpanded[committee.thomasId] = !this.committeesExpanded[committee.thomasId];
  }

  public isExpanded(committee: Committee): boolean {
    return this.committeesExpanded[committee.thomasId];
  }
}
