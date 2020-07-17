import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopsComponent } from './desktops.component';

describe('DesktopsComponent', () => {
  let component: DesktopsComponent;
  let fixture: ComponentFixture<DesktopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
