import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
    templateUrl: './check-in.component.html',
})

export class CheckInComponent implements OnInit {

    isSuccess: boolean = false;
    isError: boolean = false;

    constructor(
        private apiService: ApiService,
        public dialog: MatDialog,
    ) {}

    ngOnInit(): void {

    }

    checkIn() {
        this.apiService.checkIn().subscribe({
            next: (info) => {
                this.isSuccess = true;
                console.log(info);
                alert(`${info.success}`);
            },
            error: (error) => {
                this.isError = true;
                console.log(error);
                alert(`${error.error.error}`);
            }
        });
    }

}
