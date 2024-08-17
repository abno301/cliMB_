import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = false;

    constructor(private keycloakService: KeycloakService) {
        this.checkLoginStatus();
    }

    getToken(): any {
        return this.keycloakService.getToken();
    }

    async checkLoginStatus() {
        this.loggedIn = this.keycloakService.isLoggedIn();
        console.log("User is logged in: ", this.loggedIn);
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

    logout() {
        this.keycloakService.logout(window.location.origin);
    }
}
