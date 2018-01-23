import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { environment } from '../../environments/environment';
import { OptionsDialogComponent } from '../core/options-dialog/options-dialog.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.pug',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  version: string = environment.version;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() { }

  public openOptionsDialog(): void {
    this.dialog.open(OptionsDialogComponent);
  }

}
