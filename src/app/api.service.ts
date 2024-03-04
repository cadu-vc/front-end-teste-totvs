import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient) { }

  salvarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, cliente);
  }

  buscarClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/findAll`);
  }
}
