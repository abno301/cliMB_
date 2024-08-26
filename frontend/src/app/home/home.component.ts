import { Component } from '@angular/core';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import { faDumbbell, faBeerMugEmpty, faSquareParking, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  public faBeerMugEmpty = faBeerMugEmpty;
  public faDumbbell = faDumbbell;
  public faSquareParking = faSquareParking;
  public faCalendarDays = faCalendarDays;

  constructor(library: FaIconLibrary, private router: Router,) {
    library.addIcons(faBeerMugEmpty);
  }

  goUrnik() {
    this.router.navigate(["/urnik"]);
  }

  goPregled() {
    this.router.navigate(["/pregled-prostorov"]);
  }
}
