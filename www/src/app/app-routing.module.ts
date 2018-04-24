import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpectrumComponent} from "./spectrogram/spectrum/spectrum.component";
import {BrowserModule} from "@angular/platform-browser";

const routes: Routes = [
  {
    path: '',
    component: SpectrumComponent,
    data: {title: 'FREQing Awesome'},
  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
