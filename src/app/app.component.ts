import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],  // Correctly importing standalone components
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shopping';
  filteredProducts: any[] = [];
  updateFilteredProducts(products: any[]): void { this.filteredProducts = products;
  }


  constructor(private productService: ProductService) {}
   ngOnInit() {
     this.checkAndUpdateLocalStorage(); 
    } 

    checkAndUpdateLocalStorage() { this.checkAndUpdateProductData(); this.checkAndUpdateSignupData();}

    checkAndUpdateProductData() {
      const productData = localStorage.getItem('products');
    
      if (!productData) {
        this.productService.fetchProductDetails().subscribe(
          data => {
            try {
              const cleanData = JSON.parse(data.replace(/\\r\\n|\\t/g, ''));
              localStorage.setItem('products', JSON.stringify(cleanData));
            } catch (error) {
              console.error('Error cleaning or parsing product data:', error);
            }
          },
          error => {
            console.error('Error fetching product data:', error);
          }
        );
      } else {
        console.log('LocalStorage already has product data:', productData);
      }
    }
  

    checkAndUpdateSignupData(){
      const signupData = localStorage.getItem('signupData'); 
      if (!signupData) { 
        this.productService.fetchSignupDetails().subscribe( data => { 
          try { const cleanData = JSON.parse(data.replace(/\\r\\n|\\t/g, ''));
             localStorage.setItem('signupData', JSON.stringify(cleanData));
             } catch (error) { 
              console.error('Error cleaning or parsing signup data:', error); 
            } 
          }, error => { console.error('Error fetching signup data:', error); 

          } ); 
        } else { 
          console.log('LocalStorage already has signup data:', signupData); 
        } 
    }
}
