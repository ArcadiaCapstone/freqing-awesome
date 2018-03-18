import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpectrumComponent } from './spectrum/spectrum.component';
import { SpectrogramComponent } from './spectrogram.component';
import { CoreModule } from './core/core.module';
import {ToggleComponent} from "./toggle/toggle.component";
import {DataExportComponent} from "./data-export/data-export.component";
import {SettingsComponent} from "./settings/settings.component";
import {CdkTableModule} from '@angular/cdk/table';
import { SpecialsComponent } from './specials/specials.component';
import { FilesComponent } from './files/files.component';
import {NavMenuComponent} from "./nav-menu/nav-menu.component";
import {BrowserModule} from "@angular/platform-browser";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import '../../polyfills';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    BrowserModule
  ],
  declarations: [
    SpectrumComponent,
    SpectrogramComponent,
    ToggleComponent,
    DataExportComponent,
    SettingsComponent,
    NavMenuComponent,
    SpecialsComponent,
    FilesComponent,
  ],
  bootstrap: [
    NavMenuComponent
  ],


})
export class SpectrogramModule { }








