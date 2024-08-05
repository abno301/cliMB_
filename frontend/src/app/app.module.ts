import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AppRoutingModule} from "./app-routing.module";
import {HomeComponent} from "./home/home.component";
import {BrowserModule} from "@angular/platform-browser";
import {NakupKartComponent} from "./nakup-kart/nakup-kart.component";

function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
        keycloak.init({
            config: {
                url: 'http://localhost:8080/auth',
                realm: 'flask-demo',
                clientId: 'flask',
            },
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri:
                    window.location.origin + '/assets/silent-check-sso.html',
            },
        });
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NakupKartComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        NgOptimizedImage,
        RouterLink,
        AppRoutingModule,
        KeycloakAngularModule
    ],

    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }