import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {SafeUrl} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";
import {interval, Subscription, switchMap} from "rxjs";
import {DatePipe} from "@angular/common";

export interface RecentUsers {
    title: string,
    prihod: string,
    userImageUrl?: SafeUrl
}


@Component({
    templateUrl: './pregled.component.html',
})

export class PregledComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    userImageUrl: SafeUrl | null = null;

    users: RecentUsers[] = [];

    constructor(
        private apiService: ApiService,
        public dialog: MatDialog,
        private datePipe: DatePipe
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

        // Schedule the request to be made every 5 seconds using RxJS interval
        this.subscription = interval(5000).pipe(
            switchMap(() => this.apiService.getRecentUsers()))
                .subscribe({ next: response => {
                    this.users = response.recent_users.map((user: { check_in_time: string | number | Date; username: any; userImageUrl: SafeUrl }) =>  {
                        const formattedDateTime = this.datePipe.transform(user.check_in_time, 'HH:mm MMM dd, yyyy');

                        return {
                            title: `${user.username}`,
                            userImageUrl: `${user.userImageUrl}`,
                            prihod: formattedDateTime
                        };
                    });
                    console.log('Response from backend:', response);
                }});
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
