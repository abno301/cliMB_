import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {NakupKartComponent} from "./nakup-kart/nakup-kart.component";
import {AuthGuard} from "./guards/auth.guard"; // Replace with your actual component
import { UrnikComponent } from './urnik/urnik.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'urnik', component: UrnikComponent },
    { path: 'nakup-kart', component: NakupKartComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }