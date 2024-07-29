import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, NgOptimizedImage, RouterLink],
    templateUrl: './app.component.html',
})

export class AppComponent {
    title = 'cliMB';

    constructor(private router: Router) { }

    goHome() {
        this.router.navigate(["/"]);
    }
}
