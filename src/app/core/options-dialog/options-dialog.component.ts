import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { UserOptionsService, PartyColoringMode } from '../user-options.service';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-options-dialog',
  templateUrl: './options-dialog.component.pug',
  styleUrls: ['./options-dialog.component.scss']
})
export class OptionsDialogComponent implements OnInit {

  constructor(
    public options: UserOptionsService,
    private dialogRef: MatDialogRef<OptionsDialogComponent>,
  ) { }

  ngOnInit() {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.dialogRef.close();
        break;
      default:
        break;
    }
  }

  public get AllPartyColoringModes(): string[] {
    return UserOptionsService.AllPartyColoringModes;
  }

  public get isPartyColoringProportional(): boolean {
    return this.options.partyColoringMode === PartyColoringMode.Proportion;
  }

  public get AllColorMixModes(): string[] {
    return UserOptionsService.AllColorMixModes;
  }

  public get showColorMixMode(): boolean {
    return environment.showColorMixingOptions;
  }
}
