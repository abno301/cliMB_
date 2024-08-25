import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";
import {forkJoin, interval, map, Subscription, switchMap} from "rxjs";
import {DatePipe} from "@angular/common";
import {AuthService} from "../services/auth.service";


@Component({
    templateUrl: './pregled-prostorov.component.html',
})

export class PregledProstorovComponent {


    constructor(
        public dialog: MatDialog,
    ) {}


}
