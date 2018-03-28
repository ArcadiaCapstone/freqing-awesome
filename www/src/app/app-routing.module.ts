 import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpectrumComponent} from "./spectrogram/spectrum/spectrum.component";
 import {ToggleComponent} from "./spectrogram/spectrum/toggle/toggle.component";
 import {PlaylistComponent} from "./spectrogram/spectrum/playlist/playlist.component";
 import {SettingsComponent} from "./spectrogram/spectrum/settings/settings.component";
 import {SpecialsComponent} from "./spectrogram/spectrum/specials/specials.component";
 import {LoginComponent} from "./spectrogram/spectrum/login/login.component";
 import {BrowserModule} from "@angular/platform-browser";

const routes: Routes = [
  {
    path: '',
    component: SpectrumComponent,
    data: { title: 'FREQing Awesome' },
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]}

];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [SpectrumComponent, ToggleComponent, PlaylistComponent, SettingsComponent, SpecialsComponent, LoginComponent];
