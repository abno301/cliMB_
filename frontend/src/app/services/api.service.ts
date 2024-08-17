import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private apiUrl = 'http://localhost:5000';  // Your Flask backend URL

    constructor(private http: HttpClient) {
    }

    checkUsers(): Observable<any> {
        console.log("in api users :#");
        return this.http.get<any>(`${this.apiUrl}/check-users`);
    }
}