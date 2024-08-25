import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DodajDogodekComponent} from './dodaj-dogodek/dodaj-dogodek.component';
import {Dogodek} from '../shared/models';
import {AuthService} from "../services/auth.service";
import {ApiService} from "../services/api.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  templateUrl: './urnik.component.html',
  styleUrls: ['./urnik.component.css']
})
export class UrnikComponent implements OnInit{
  rows = [1, 2, 3, 4, 5];
  cols = [1, 2, 3, 4, 5];
  colors: string[][] = [];


  dogodki: Dogodek[] = [];

  jeZaposlen: boolean = false;

  isSmallScreen: boolean = false;

  constructor(public dialog: MatDialog,
              private apiService: ApiService,
              protected authService: AuthService,
              private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  ngOnInit(): void {
    this.generateFixedColors();
    if (this.authService.trenutni_uporabnik) {
      this.jeZaposlen = this.authService.trenutni_uporabnik.role == "zaposlen";
    }

    this.apiService.getUrnik().subscribe({
      next: dogodki => {
        if (dogodki) {
          this.dogodki = dogodki;
        }
      }
    });
  }

  openDialog(vrsta: number, stolpec: number): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '50vh';
    dialogConfig.height = '45vh';


    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = { vrsta: vrsta, stolpec: stolpec, ime: '', ura: '' };

    const dialogRef = this.dialog.open(DodajDogodekComponent, dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log(result);
        let dogodek: Dogodek = {
          ime: result.ime,
          ura: result.ura,
          vrsta: result.vrsta,
          stolpec: result.stolpec,
          barva: result.barva
        }
        const existingIndex = this.dogodki.findIndex(d => d.vrsta === dogodek.vrsta && d.stolpec === dogodek.stolpec);

        if (existingIndex !== -1) {
          this.dogodki[existingIndex] = dogodek;
        } else {
          this.dogodki.push(dogodek);
        }
        this.apiService.updateUrnik(this.dogodki).subscribe({
          next: _ => {},
          error: err => console.log("Error while updating schedule: ", err)
        });

      }
    });
  }


  najdiDogodek(vrsta: number, stolpec: number): Dogodek | undefined {
    return this.dogodki.find(dogodek => dogodek.vrsta === vrsta && dogodek.stolpec === stolpec);
  }

  generateFixedColors(): void {
    this.colors = [
      ['#4DB6AC', '#29B6F6', '#1E88E5', '#0D47A1', '#42A5F5'],
      ['#1976D2', '#90CAF9', '#64B5F6', '#1565C0', '#2196F3'],
      ['#448AFF', '#2979FF', '#2962FF', '#82B1FF', '#4FC3F7'],
      ['#03A9F4', '#0288D1', '#0277BD', '#01579B', '#80D8FF'],
      ['#40C4FF', '#00B0FF', '#0091EA', '#81D4FA', '#2196F3']
    ];
  }
}
