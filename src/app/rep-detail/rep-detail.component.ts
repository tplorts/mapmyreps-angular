import { Component, OnInit, Input } from '@angular/core';

import { Legislator, Committee } from '../data/congress';



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

  public committeesExpanded: { [thomasId: string]: boolean };

  @Input()
  rep: Legislator;

  constructor() { }

  ngOnInit() {
    this.committeesExpanded = {};
  }

  public hasSubs(committee: Committee): boolean {
    const subs = this.rep.subcommittees[committee.thomasId];
    return subs && subs.length > 0;
  }

  public committeeItemClasses(committee: Committee): object {
    return {
      // empty: !this.hasSubs(committee),
      expanded: this.isExpanded(committee),
    };
  }

  public expand(committee: Committee): void {
    this.committeesExpanded[committee.thomasId] = !this.committeesExpanded[committee.thomasId];
  }

  public isExpanded(committee: Committee): boolean {
    return this.committeesExpanded[committee.thomasId];
  }
}
