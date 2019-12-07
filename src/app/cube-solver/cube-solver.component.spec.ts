import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeSolverComponent } from './cube-solver.component';

describe('CubeSolverComponent', () => {
  let component: CubeSolverComponent;
  let fixture: ComponentFixture<CubeSolverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubeSolverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubeSolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
