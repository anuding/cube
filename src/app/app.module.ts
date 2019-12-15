import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CubeSolverComponent } from './cube-solver/cube-solver.component';
import { Cube101Component } from './cube101/cube101.component';
import { FillColorComponent } from './fill-color/fill-color.component';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
  declarations: [
    AppComponent,
    CubeSolverComponent,
    Cube101Component,
    FillColorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
