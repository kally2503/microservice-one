import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getJavaHealth(): Observable<any> {
    return this.http.get(`${environment.javaApiUrl}/api/health`);
  }

  getJavaData(): Observable<any> {
    return this.http.get(`${environment.javaApiUrl}/api/data`);
  }

  getPythonHealth(): Observable<any> {
    return this.http.get(`${environment.pythonApiUrl}/api/health`);
  }

  getPythonUsers(): Observable<any> {
    return this.http.get(`${environment.pythonApiUrl}/api/users`);
  }
}
