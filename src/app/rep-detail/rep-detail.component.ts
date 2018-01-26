import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Legislator, Committee } from '../data/congress';



@Component({
  selector: 'app-rep-detail',
  templateUrl: './rep-detail.component.pug',
  styleUrls: ['./rep-detail.component.scss']
})
export class RepDetailComponent implements OnInit {
  private _rep: Legislator;

  public committeesExpanded: { [thomasId: string]: boolean };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.rep = this.route.snapshot.data.rep;
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
