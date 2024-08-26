import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";
import {forkJoin, interval, map, Subscription, switchMap} from "rxjs";
import {DatePipe} from "@angular/common";
import {AuthService} from "../services/auth.service";

export interface RecentUsers {
    title: string;
    prihod: string;
    userImageUrl?: SafeUrl;
    image_url: string;
}


@Component({
    templateUrl: './pregled.component.html',
})

export class PregledComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    jeZaposlen: boolean = false;

    users: RecentUsers[] = [];

    loading: boolean = true;

    constructor(
        private apiService: ApiService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private domSanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {

        // Dobi vse nedanje uporabnike, ki so porabili karto oz. se check inali.
        this.subscription = interval(5000).pipe(
            switchMap(() => this.apiService.getRecentUsers()),
            switchMap(response => {
                let usersWithImages: RecentUsers[] = response.recent_users.map((user: { check_in_time: string | number | Date; username: any; image_url: string }) => {
                    const formattedDateTime = this.datePipe.transform(user.check_in_time, 'HH:mm MMM dd, yyyy');

                    return {
                        title: `${user.username}`,
                        userImageUrl: '', // To bo blob potem
                        prihod: formattedDateTime,
                        image_url: user.image_url // Za pozneje - za fetch
                    };
                });

                const imageRequests = usersWithImages.map((user) =>
                    this.apiService.getUserImage(user.image_url).pipe(
                        map(blob => {
                            const url = URL.createObjectURL(blob);
                            user.userImageUrl = this.domSanitizer.bypassSecurityTrustUrl(url) as string;
                            return user;
                        })
                    )
                );
                // Fork join pocaka na vse requeste
                return forkJoin(imageRequests);
            })
        ).subscribe({
            next: (usersWithImages: RecentUsers[]) => {
                this.users = usersWithImages;
                this.jeZaposlen = true;
                this.loading = false;
            },
            error: (_) => {
                this.jeZaposlen = false;
                this.loading = false;
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
