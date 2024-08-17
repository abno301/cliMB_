import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import {Uporabnik} from "../shared/models";
import {ApiService} from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = false;

    public trenutni_uporabnik: Uporabnik;

    constructor(private keycloakService: KeycloakService, private apiService: ApiService) {
        this.checkLoginStatus();
    }

    getToken(): any {
        return this.keycloakService.getToken();
    }

    async checkLoginStatus() {
        this.loggedIn = this.keycloakService.isLoggedIn();
        if (this.loggedIn) {
           await this.keycloakService.loadUserProfile();
           this.apiService.getCurrentUser(this.keycloakService.getUsername()).subscribe({
               next: user => {
                   this.trenutni_uporabnik = {
                       email: user.email,
                       role: user.role
                   };
                   console.log("User is logged in: ", this.trenutni_uporabnik.email);
               },
               error: err => this.trenutni_uporabnik = {email: "", role: ""}
           })
        } else { this.trenutni_uporabnik = {email: "", role: ""}}
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

    logout() {
        this.keycloakService.logout(window.location.origin);
    }
}
