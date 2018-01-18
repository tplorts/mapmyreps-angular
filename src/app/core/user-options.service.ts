import { Injectable, EventEmitter } from '@angular/core';



export enum PartyColoringMode {
  Majority = 'Majority',
  Proportion = 'Proportion',
}

export enum ColorMixMode {
  rgb = 'rgb',
  hsl = 'hsl',
  lab = 'lab',
  lch = 'lch',
  lrgb = 'lrgb',
}



@Injectable()
export class UserOptionsService {
  public static readonly AllPartyColoringModes = Object.values(PartyColoringMode);
  public static readonly AllColorMixModes = Object.values(ColorMixMode);

  public isPartyColoringOn = true;

  private _partyColoringMode = PartyColoringMode.Proportion;
  public readonly partyColoringModeChange = new EventEmitter<PartyColoringMode>();

  private _colorMixMode = ColorMixMode.lab;
  public readonly colorMixModeChange = new EventEmitter<ColorMixMode>();

  constructor() { }

  public get partyColoringMode(): PartyColoringMode {
    return this._partyColoringMode;
  }

  public set partyColoringMode(v: PartyColoringMode) {
    this._partyColoringMode = v;
    this.partyColoringModeChange.emit(v);
  }

  public get colorMixMode(): ColorMixMode {
    return this._colorMixMode;
  }

  public set colorMixMode(v: ColorMixMode) {
    this._colorMixMode = v;
    this.colorMixModeChange.emit(v);
  }
}
