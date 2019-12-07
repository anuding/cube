import { Component, OnInit } from '@angular/core';
import { SimpleCube } from '../../libs/SimpleCube';

@Component({
  selector: 'app-cube-solver',
  templateUrl: './cube-solver.component.html',
  styleUrls: ['./cube-solver.component.scss']
})
export class CubeSolverComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var component = new SimpleCube();
    component.start();
  }

}
