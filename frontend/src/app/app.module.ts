import { NgModule, APP_INITIALIZER, isDevMode } from '@angular/core';
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
import { ServiceWorkerModule } from '@angular/service-worker';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { UrnikComponent } from './urnik/urnik.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DodajDogodekComponent } from './urnik/dodaj-dogodek/dodaj-dogodek.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {NgxStripeModule} from "ngx-stripe";
import {PaymentForm} from "./nakup-kart/payment-form/payment-form";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

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
        NakupKartComponent,
        UrnikComponent,
        DodajDogodekComponent,
        PaymentForm
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
        KeycloakAngularModule,
        FontAwesomeModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        NgxStripeModule.forRoot('pk_test_51PqU9fJQdsxzu2zOEIU2a3J8IC7xGvCCa5VzCNy6OedV7j4jWGhRTkIzUR126BvA5MSdenMKIWDPXjH3yDJLJp4M00ZpI4TY5v'),
        MatCardModule,
        MatDividerModule,
        MatTableModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        }
    ],
    bootstrap: [AppComponent, PaymentForm]
})
export class AppModule { }