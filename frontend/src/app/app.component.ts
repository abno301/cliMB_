import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {KeycloakService} from "keycloak-angular";
import {AuthService} from "./services/auth.service";
import {ApiService} from "./services/api.service";
import {faBeerMugEmpty, faUser} from '@fortawesome/free-solid-svg-icons';
import {Uporabnik} from "./shared/models";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
    public faUser = faUser;

    loading: boolean = true;

    trenutni_uporabnik: Uporabnik;

    jeZaposlen: boolean = false;

    veljavnaDo: string;

    stKart: number;

    constructor(
        private router: Router,
        private keycloakService: KeycloakService,
        protected authService: AuthService,
        private apiService: ApiService
    ) {}

    ngOnInit() {
        this.authService.checkLoginStatus();
        this.authService.getTrenutniUporabnik().subscribe({
            next: (uporabnik) => {
                let formattedDate;
                if (uporabnik.veljavnaDo) {
                    formattedDate = uporabnik.veljavnaDo.getFullYear() + '-' +
                        ('0' + (uporabnik.veljavnaDo.getMonth() + 1)).slice(-2) + '-' +
                        ('0' + uporabnik.veljavnaDo.getDate()).slice(-2);
                    this.veljavnaDo = formattedDate;
                }
                this.stKart = uporabnik.celodnevneKarte !== undefined ? uporabnik.celodnevneKarte : 0;

                this.trenutni_uporabnik = uporabnik;
                if (uporabnik.role == "zaposlen") {
                    this.jeZaposlen = true;
                }
                console.log(this.trenutni_uporabnik);
                this.loading = false;
            }
        })
        this.apiService.checkUsers().subscribe({
            next: (_) => console.log("lals"),
            error: err => console.log("Error while checking users", err)
        });
    }

    goHome() {
        this.router.navigate(["/"]);
    }

    goNakupKart() {
        this.router.navigate(["/nakup-kart"]);
    }

    goPregledProstorov() {
        this.router.navigate(["/pregled-prostorov"]);
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

    redirectToKeycloak(): void {
        const keycloakUrl = 'http://localhost:8080/auth/realms/cliMB/protocol/openid-connect/auth';
        const clientId = 'flask';
        const redirectUri = encodeURIComponent('http://localhost:4200/');
        const state = '8b03c486-e1fb-4bc1-88d3-4a0698259956'; // You might want to generate this dynamically
        const responseMode = 'fragment';
        const responseType = 'code';
        const scope = 'openid';
        const nonce = '43c5c9e5-a6bc-411c-8355-f9e83bf22d9d'; // You might want to generate this dynamically

        const authUrl = `${keycloakUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&response_mode=${responseMode}&response_type=${responseType}&scope=${scope}&nonce=${nonce}`;

        window.location.href = authUrl;
    }

    protected readonly faBeerMugEmpty = faBeerMugEmpty;
}
