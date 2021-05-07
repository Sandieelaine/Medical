import { Injectable } from '@angular/core';
import { Quote } from '../models/quote.model';
import { ClaimsData } from '../mocks/claims';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private http: HttpClient) { }

  // Claims Logic
  
  
}
