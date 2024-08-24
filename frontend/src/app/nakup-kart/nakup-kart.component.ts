import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {AuthService} from "../services/auth.service";
import {SafeUrl} from '@angular/platform-browser';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PaymentForm} from "./payment-form/payment-form";

@Component({
    selector: 'nakup-kart',
    templateUrl: './nakup-kart.component.html',
})

export class NakupKartComponent implements OnInit {

    selectedFile: File | null = null;
    displayedColumns: string[] = ['vstopnica', 'celodnevna', 'dopoldanska', 'popoldanska', 'deset_plus_en', 'mesecna', 'tri_mescna', 'letna'];

    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        public dialog: MatDialog,
    ) {}

    ngOnInit(): void {

    }


    tickets = [
        { vstopnica: 'Predšolski otroci', celodnevna: 4.50, dopoldanska: 4.00, popoldanska: 4.00, deset_plus_en: 45.00, mesecna: 36.00, tri_mescna: 90.00, letna: 190.00 },
        { vstopnica: 'Šolarji', celodnevna: 9.50, dopoldanska: 8.50, popoldanska: 8.50, deset_plus_en: 95.00, mesecna: 76.00, tri_mescna: 190.00, letna: 400.00 },
        { vstopnica: 'Odrasli', celodnevna: 15.00, dopoldanska: 13.50, popoldanska: 13.50, deset_plus_en: 150.00, mesecna: 120.00, tri_mescna: 300.00, letna: 630.00 },
    ];

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
            next: response => console.log('Slika uspešno naložena!', response),
            error: err => console.error('Napaka pri nalaganju slike: ', err),
        });
    }

    openPayment(): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = { email: this.authService.trenutni_uporabnik.email, amount: 1000 }

        const dialogRef = this.dialog.open(PaymentForm, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result) {

            }
        });
    }

}
