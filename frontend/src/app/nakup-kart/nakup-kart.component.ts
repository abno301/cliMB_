import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {AuthService} from "../services/auth.service";
import {SafeUrl} from '@angular/platform-browser';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PaymentForm} from "./payment-form/payment-form";
import {Uporabnik} from "../shared/models";
import {switchMap} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
    templateUrl: './nakup-kart.component.html',
})

export class NakupKartComponent implements OnInit {

    loading: boolean = true;
    loading2: boolean = true;

    selectedFile: File | null = null;
    displayedColumns: string[] = ['vstopnica', 'celodnevna', 'deset_plus_en', 'mesecna', 'letna'];

    trenutniUporabnik: Uporabnik;
    imaSliko: boolean = false;

    isSmallScreen: boolean = false;

    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        public dialog: MatDialog,
        private breakpointObserver: BreakpointObserver
    ) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.isSmallScreen = result.matches;
        });
    }

    ngOnInit(): void {
        this.authService.getTrenutniUporabnik().pipe(
            switchMap(uporabnik => {
                this.trenutniUporabnik = uporabnik;
                this.loading = false;

                return this.apiService.checkPicture();
            })
        ).subscribe({
            next: () => {
                this.imaSliko = true;
                this.loading2 = false;
            },
            error: () => {
                this.imaSliko = false;
                this.loading2 = false;
            }
        });
    }


    tickets = [{
        vstopnica: 'Odrasli',
        celodnevna: 10.00,
        deset_plus_en: 100.00,
        mesecna: 70.00,
        letna: 400.00
    }];

    onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            this.selectedFile = fileInput.files[0];
        }
    }

    uploadImage(): void {
        if (!this.selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append('image', this.selectedFile, this.selectedFile.name);
        formData.append('username', this.authService.trenutni_uporabnik.email);

        this.apiService.uploadPicture(formData).subscribe({
            next: response => {
                this.imaSliko = true;
                console.log('Slika uspešno naložena!', response)
            },
            error: err => console.error('Napaka pri nalaganju slike: ', err),
        });
    }

    openPayment(amount: number, title: string): void {
        const dialogConfig = new MatDialogConfig();



        dialogConfig.data = { email: this.authService.trenutni_uporabnik.email, amount: amount, title: title }

        const dialogRef = this.dialog.open(PaymentForm, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result) {

            }
        });
    }

}
