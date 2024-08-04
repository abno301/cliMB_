import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {KeycloakService} from "keycloak-angular";
import {AuthService} from "./services/auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
    title = 'cliMB';

    constructor(private router: Router, private keycloakService: KeycloakService, protected authService: AuthService) { }

    ngOnInit() {
        this.authService.checkLoginStatus();
    }

    goHome() {
        this.router.navigate(["/"]);
    }
    goNakupKart() {
        this.router.navigate(["/nakup-kart"]);
    }

    logout() {
        this.keycloakService.logout(window.location.origin);
    }
}
