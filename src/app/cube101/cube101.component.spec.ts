import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cube101Component } from './cube101.component';

describe('Cube101Component', () => {
  let component: Cube101Component;
  let fixture: ComponentFixture<Cube101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cube101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cube101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
