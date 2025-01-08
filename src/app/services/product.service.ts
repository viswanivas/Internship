import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productUrl = 'assets/files/products.txt'; // Path to your text file 
  private signupUrl = 'assets/files/signupData.json'; // Path to your text file

  constructor(private http: HttpClient) {} 
  
  fetchProductDetails(): Observable<any> { 
    return this.http.get<any>(this.productUrl,{ responseType: 'text' as 'json'});
   }

   fetchSignupDetails(): Observable<any> { 
    return this.http.get<any>(this.signupUrl, { responseType: 'text' as 'json' }); }
}
