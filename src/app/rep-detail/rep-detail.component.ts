import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Logger } from '@app/core/logger.service';
import { Legislator, Committee } from '@usa-data/congress';
import { RepStatusService } from '@app/rep-status.service';

const log = new Logger('Rep Detail');



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
    private repStatus: RepStatusService,
  ) {
  }

  ngOnInit() {
    // An OK way for now to avoid ExpressionChangedAfterItHasBeenCheckedError.
    // This will only delay (unnoticably) the update when the rep detail view
    // is first shown for a state.
    Promise.resolve().then(() => {
      this.route.data.subscribe(nextData => {
        this.rep = nextData.rep;
        this.repStatus.select(this.rep);
      });
    });
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
