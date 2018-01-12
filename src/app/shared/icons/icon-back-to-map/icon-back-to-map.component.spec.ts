import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBackToMapComponent } from './icon-back-to-map.component';

describe('IconBackToMapComponent', () => {
  let component: IconBackToMapComponent;
  let fixture: ComponentFixture<IconBackToMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconBackToMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconBackToMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
