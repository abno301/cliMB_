import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  templateUrl: './dodaj-dogodek.component.html',
})
export class DodajDogodekComponent {

  colors = ['#FF5722', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'];

  constructor(
    public dialogRef: MatDialogRef<DodajDogodekComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ime: string; ura: string; barva: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
