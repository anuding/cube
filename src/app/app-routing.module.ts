import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CubeSolverComponent } from './cube-solver/cube-solver.component';


const routes: Routes = [
  { path: 'cube_solver', component: CubeSolverComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
