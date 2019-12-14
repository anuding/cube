import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CubeSolverComponent } from './cube-solver/cube-solver.component';
import { Cube101Component } from './cube101/cube101.component';

@NgModule({
  declarations: [
    AppComponent,
    CubeSolverComponent,
    Cube101Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
