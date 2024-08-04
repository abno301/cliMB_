import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {KeycloakService} from "keycloak-angular";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent {
    title = 'cliMB';

    constructor(private router: Router) { }

    // ngOnInit() {
    //     if (this.keycloakService.isLoggedIn()) {
    //         console.log('User is logged in:');
    //     }
    // }

    goHome() {
        this.router.navigate(["/"]);
    }
}
