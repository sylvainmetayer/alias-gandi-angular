import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GandiComponent } from './gandi.component';

describe('GandiComponent', () => {
  let component: GandiComponent;
  let fixture: ComponentFixture<GandiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GandiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GandiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
