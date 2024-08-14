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

  constructor(public dialog: MatDialog) {
    this.generateColors();
  }

  ngOnInit(): void {
    // this.generateColors();
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


  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  generateColors(): void {
    for (let i = 0; i < this.rows.length; i++) {
      this.colors[i] = [];
      for (let j = 0; j < this.cols.length; j++) {
        this.colors[i][j] = this.getRandomColor();
      }
    }
  }
  
}
