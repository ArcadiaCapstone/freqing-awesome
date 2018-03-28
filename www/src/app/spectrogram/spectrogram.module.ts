import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpectrumComponent } from './spectrum/spectrum.component';
import { CoreModule } from './core/core.module';
import {CdkTableModule} from '@angular/cdk/table';
import {NavMenuComponent} from "./spectrum/nav-menu/nav-menu.component";
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
import {AppRoutingModule, routingComponents} from "../app-routing.module";
import {ToggleComponent} from "./spectrum/toggle/toggle.component";
import {LoginComponent} from "./spectrum/login/login.component";
import {SpecialsComponent} from "./spectrum/specials/specials.component";
import {SettingsComponent} from "./spectrum/settings/settings.component";
import {PlaylistComponent} from "./spectrum/playlist/playlist.component";

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
    BrowserModule,
    AppRoutingModule,

  ],
  declarations: [
    SpectrumComponent,
    ToggleComponent,
    PlaylistComponent,
    LoginComponent,
    SpecialsComponent,
    SettingsComponent,
    NavMenuComponent,
  ],
  bootstrap: [],

})
export class SpectrogramModule { }








