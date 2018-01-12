import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NationMapComponent } from './nation-map.component';

describe('MapViewComponent', () => {
  let component: NationMapComponent;
  let fixture: ComponentFixture<NationMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NationMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
