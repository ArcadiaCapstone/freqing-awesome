import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpectrumComponent} from "./spectrogram/spectrum/spectrum.component";

const routes: Routes = [
  {
    path: '**',
    component: SpectrumComponent,
    data: { title: 'FREQing Awesome' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
