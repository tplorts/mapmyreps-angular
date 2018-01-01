import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepDetailComponent } from './rep-detail.component';

describe('RepDetailComponent', () => {
  let component: RepDetailComponent;
  let fixture: ComponentFixture<RepDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
