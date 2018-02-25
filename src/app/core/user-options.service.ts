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


  private _isPartyColoringOn: boolean;
  public readonly partyColoringOnChange = new EventEmitter<boolean>();

  private _partyColoringMode: PartyColoringMode;
  public readonly partyColoringModeChange = new EventEmitter<PartyColoringMode>();

  private _colorMixMode: ColorMixMode;
  public readonly colorMixModeChange = new EventEmitter<ColorMixMode>();

  private _alwaysShowMap: boolean;
  public readonly alwaysShowMapChange = new EventEmitter<boolean>();


  constructor() {
    this.isPartyColoringOn = this.initial('isPartyColoringOn', true);
    this.partyColoringMode = this.initial('partyColoringMode', PartyColoringMode.Proportion);
    this.colorMixMode = this.initial('colorMixMode', ColorMixMode.lab);
    this.alwaysShowMap = this.initial('alwaysShowMap', false);
  }

  private initial<T>(key: string, defaultValue: T): T {
    const value = this.load(key);
    return value === null ? defaultValue : value;
  }

  private load(key: string) {
    const value = localStorage.getItem(key);
    return value && JSON.parse(value);
  }

  private save(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get isPartyColoringOn(): boolean {
    return this._isPartyColoringOn;
  }

  public set isPartyColoringOn(on: boolean) {
    this._isPartyColoringOn = on;
    this.save('isPartyColoringOn', on);
    this.partyColoringOnChange.emit(on);
  }

  public get partyColoringMode(): PartyColoringMode {
    return this._partyColoringMode;
  }

  public set partyColoringMode(v: PartyColoringMode) {
    this._partyColoringMode = v;
    this.save('partyColoringMode', v);
    this.partyColoringModeChange.emit(v);
  }

  public get colorMixMode(): ColorMixMode {
    return this._colorMixMode;
  }

  public set colorMixMode(v: ColorMixMode) {
    this._colorMixMode = v;
    this.save('colorMixMode', v);
    this.colorMixModeChange.emit(v);
  }

  public get alwaysShowMap(): boolean {
    return this._alwaysShowMap;
  }

  public set alwaysShowMap(v: boolean) {
    this._alwaysShowMap = v;
    this.save('alwaysShowMap', v);
    this.alwaysShowMapChange.emit(v);
  }
}
