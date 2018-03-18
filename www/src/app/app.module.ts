import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {SpectrogramModule} from "./spectrogram/spectrogram.module";

import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import {environment} from "../environments/environment";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {DemoMaterialModule} from "../main";
import {MatNativeDateModule} from "@angular/material";
import {NavMenuComponent} from "./spectrogram/nav-menu/nav-menu.component";


@NgModule({
  imports: [

  ],

})

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AppRoutingModule,
    SpectrogramModule,

  ],
  // entryComponents: [NavMenuComponent],
  providers: [],
  bootstrap: [
    AppComponent,
    NavMenuComponent
  ]

})
export class AppModule { }
