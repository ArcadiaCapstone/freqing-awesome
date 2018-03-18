import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpectrumComponent } from './spectrum/spectrum.component';
import { SpectrogramComponent } from './spectrogram.component';
import { CoreModule } from './core/core.module';
import {ToggleComponent} from "./toggle/toggle.component";
import {DataExportComponent} from "./data-export/data-export.component";
import {SettingsComponent} from "./settings/settings.component";
import '../../polyfills';
import {CdkTableModule} from '@angular/cdk/table';
import { MenuTogglerComponent } from './menu-toggler/menu-toggler.component';
import { SpecialsComponent } from './specials/specials.component';
import { FilesComponent } from './files/files.component';


@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [
    CdkTableModule,
  ],
  declarations: [
    SpectrumComponent,
    SpectrogramComponent,
    ToggleComponent,
    DataExportComponent,
    SettingsComponent,
    MenuTogglerComponent,
    SpecialsComponent,
    FilesComponent,
  ],
})
export class SpectrogramModule { }

