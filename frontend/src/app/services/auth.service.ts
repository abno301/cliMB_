import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import {Uporabnik} from "../shared/models";
import {ApiService} from "./api.service";
import {catchError, from, Observable, of, switchMap} from "rxjs";

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
        // if (this.loggedIn) {
        //    await this.keycloakService.loadUserProfile();
        //    this.apiService.getCurrentUser(this.keycloakService.getUsername()).subscribe({
        //        next: user => {
        //            this.trenutni_uporabnik = {
        //                email: user.email,
        //                role: user.role
        //            };
        //            console.log("User is logged in: ", this.trenutni_uporabnik.email);
        //        },
        //        error: err => this.trenutni_uporabnik = {email: "", role: ""}
        //    })
        // } else { this.trenutni_uporabnik = {email: "", role: ""}}
    }

    getTrenutniUporabnik(): Observable<Uporabnik> {
        if (this.loggedIn) {
            return from(this.keycloakService.loadUserProfile()).pipe(
                switchMap(() => this.apiService.getCurrentUser(this.keycloakService.getUsername())),
                switchMap(user => {
                    const trenutni_uporabnik: Uporabnik = {
                        email: user.email,
                        role: user.role,
                        celodnevneKarte: user.celodnevna_karta,
                        mesecnaKarta: user.mesecna_karta,
                        letnaKarta: user.letna_karta,
                        veljavnaDo: new Date(user.veljavna_do)
                    };
                    this.trenutni_uporabnik = trenutni_uporabnik;
                    return of(trenutni_uporabnik);
                }),
                catchError(err => {
                    return of({ email: "", role: "" });
                })
            );
        } else {
            return of({ email: "", role: "" ,});
        }
    }


    isLoggedIn(): boolean {
        return this.loggedIn;
    }

    logout() {
        this.keycloakService.logout(window.location.origin);
    }
}
