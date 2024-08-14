import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatIconModule} from "@angular/material/icon";
import { DodajDogodekComponent } from './dodaj-dogodek/dodaj-dogodek.component';
import { Dogodek } from '../shared/models';

@Component({
  selector: 'urnik',
  templateUrl: './urnik.component.html',
  styleUrls: ['./urnik.component.css']
})
export class UrnikComponent implements OnInit{
  rows = [1, 2, 3, 4, 5];
  cols = [1, 2, 3, 4, 5];
  colors: string[][] = [];


  dogodki: Dogodek[] = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.generateFixedColors();
    }

  openDialog(vrsta: number, stolpec: number): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '50vh';  
    dialogConfig.height = '30vh';


    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = { vrsta: vrsta, stolpec: stolpec, ime: '', ura: '' };

    const dialogRef = this.dialog.open(DodajDogodekComponent, dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        let dogodek: Dogodek = {
          ime: result.ime,
          ura: result.ura,
          tip: "otroci",
          vrsta: result.vrsta,
          stolpec: result.stolpec
        }
        this.dogodki.push(dogodek);
        console.log('Result:', result);
      }
    });
  }


  najdiDogodek(vrsta: number, stolpec: number): Dogodek | undefined {
    
    let test = this.dogodki.find(dogodek => dogodek.vrsta === vrsta && dogodek.stolpec === stolpec);
    console.log("test: ", test);
    console.log("vsi dogodki: ", this.dogodki);
    return test;
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
