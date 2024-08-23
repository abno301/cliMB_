import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {AuthService} from "../services/auth.service";
import {SafeUrl} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";

@Component({
    templateUrl: './pregled.component.html',
})

export class PregledComponent implements OnInit {

    userImageUrl: SafeUrl | null = null;

    selectedFile: File | null = null;

    users = [
        { title: 'User 1', userImageUrl: this.userImageUrl, prihod: "16:20" },
        { title: 'User 2', userImageUrl: this.userImageUrl, prihod: "18:26" },
        { title: 'User 3', userImageUrl: this.userImageUrl, prihod: "17:45" },
        { title: 'User 4', userImageUrl: this.userImageUrl, prihod: "16:20" },
        { title: 'User 5', userImageUrl: this.userImageUrl, prihod: "17:20" },
        { title: 'User 6', userImageUrl: this.userImageUrl, prihod: "16:20" },
    ];

    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        public dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.apiService.getUserPicture().subscribe({
            next: (blob) => {
                this.userImageUrl = URL.createObjectURL(blob);
            },
            error: (error) => {
                console.error('Error fetching image:', error);
            }
        });
    }

}
