import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpectrumComponent } from './spectrum/spectrum.component';
import { SpectrogramComponent } from './spectrogram.component';
import { CoreModule } from './core/core.module';
import {ToggleComponent} from "./toggle/toggle.component";
import { MenuComponent } from './menu/menu.component';


@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: [
    SpectrumComponent,
    SpectrogramComponent,
    ToggleComponent,
    MenuComponent
  ]
})
export class SpectrogramModule { }
