import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Dogodek} from "../shared/models";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private apiUrl = 'http://localhost:5000';  // Your Flask backend URL

    constructor(private http: HttpClient) {
    }

    checkUsers(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/check-users`);
    }

    getCurrentUser(username: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/get-user/${username}`);
    }

    getUrnik(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/urnik`);
    }

    updateUrnik(dogodki: Dogodek[]): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}/urnik`,
            dogodki
        );
    }

    uploadPicture(pictureData: any): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/upload-picture`,
            pictureData
        );
    }
}