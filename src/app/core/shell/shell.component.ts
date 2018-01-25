import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObservableMedia } from '@angular/flex-layout';

import { Logger } from '../logger.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { I18nService } from '../i18n.service';
import { UserOptionsService } from '../user-options.service';

const log = new Logger('Shell');

interface IShareMedia {
  name: string;
}


@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.pug',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  static readonly ShareMedia: IShareMedia[] = [
    { name: 'facebook' },
    { name: 'twitter' },
    { name: 'pinterest' },
    { name: 'googleplus' },
    { name: 'mail' },
  ];

  private isShareOpen: boolean;

  constructor(
    private router: Router,
    private titleService: Title,
    private media: ObservableMedia,
    private authenticationService: AuthenticationService,
    private i18nService: I18nService,
    private options: UserOptionsService,
  ) { }

  ngOnInit() {
    this.isShareOpen = false;
  }

  public get shareMedia(): IShareMedia[] {
    return ShellComponent.ShareMedia;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get isAuthenticated(): boolean {
    return this.authenticationService.isAuthenticated();
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.username : null;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }

  public openShareMenu() {
    this.isShareOpen = true;
  }

  public closeShareMenu() {
    this.isShareOpen = false;
  }

  public get isShareMenuOpen(): boolean {
    return this.isShareOpen;
  }

  public share(medium: IShareMedia): void {
    log.debug(medium.name);
    this.closeShareMenu();
  }
}
