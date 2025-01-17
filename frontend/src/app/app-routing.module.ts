import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {NakupKartComponent} from "./nakup-kart/nakup-kart.component";
import {AuthGuard} from "./guards/auth.guard";
import { UrnikComponent } from './urnik/urnik.component';
import {PregledComponent} from "./pregled/pregled.component";
import {CheckInComponent} from "./check-in/check-in.component";
import {PregledProstorovComponent} from "./pregled-prostorov/pregled-prostorov.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'urnik', component: UrnikComponent },
    { path: 'nakup-kart', component: NakupKartComponent, canActivate: [AuthGuard] },
    { path: 'pregled', component: PregledComponent, canActivate: [AuthGuard] },
    { path: 'check-in', component: CheckInComponent, canActivate: [AuthGuard] },
    { path: 'pregled-prostorov', component: PregledProstorovComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }