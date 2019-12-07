import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CubeSolverComponent } from './cube-solver/cube-solver.component';
import { Cube101Component } from './cube101/cube101.component';


const routes: Routes = [
  { path: 'cubesolver', component: CubeSolverComponent },
  { path: 'cube101', component: Cube101Component }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
