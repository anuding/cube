import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillColorComponent } from './fill-color.component';

describe('FillColorComponent', () => {
  let component: FillColorComponent;
  let fixture: ComponentFixture<FillColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
