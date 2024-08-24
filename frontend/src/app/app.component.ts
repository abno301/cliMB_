import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {KeycloakService} from "keycloak-angular";
import {AuthService} from "./services/auth.service";
import {ApiService} from "./services/api.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
    title = 'cliMB';

    constructor(
        private router: Router,
        private keycloakService: KeycloakService,
        protected authService: AuthService,
        private apiService: ApiService
    ) {}

    ngOnInit() {
        this.authService.checkLoginStatus();
        this.apiService.checkUsers().subscribe({
            next: (_) => console.log('Checking if users are up to date...'),
            error: err => console.log("Error while checking users", err)
        });
    }

    goHome() {
        this.router.navigate(["/"]);
    }

    goNakupKart() {
        this.router.navigate(["/nakup-kart"]);
    }

    goUrnik() {
        this.router.navigate(["/urnik"]);
    }

    goPregled() {
        this.router.navigate(["/pregled"]);
    }

    logout() {
        this.keycloakService.logout(window.location.origin);
    }
}
