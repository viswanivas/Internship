import { Component,OnInit,ChangeDetectorRef ,Input} from '@angular/core';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-testprod',
  standalone: true,
  imports: [NavbarComponent,FooterComponent,CommonModule],
  templateUrl: './testprod.component.html',
  styleUrl: './testprod.component.css'
})
export class TestprodComponent implements OnInit
{

  products: any[] = [];
  selectedProduct: any = null;
  isModalOpen: boolean = false;
  categories: Set<string> = new Set(); // To store unique categories
  categorizedProducts: { [category: string]: any[] } = {}; // To store products by category
  selectedCategory: string = ''; 
  cart: any[] = [];
  isCartModalOpen: boolean = false;
  searchQuery: string = ''; // Current search query
  filteredProducts: any[] = []; // Filtered products for search
  showCategories: boolean = true; // Toggle categories

  selectedFilters: string[] = []; // Store selected filters


  constructor(private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void
  {
    this.loadProducts();

    this.loadCart();

       //Listen for query parameter changes
    // this.route.queryParams.subscribe(params => {
    //   this.searchQuery = params['search'] || '';
  
    //   this.filterProducts();
    // });
    this.route.queryParams.subscribe(params => { 
      this.searchQuery = params['search'] || ''; 
      this.selectedCategory = params['category'] || '';
      const selectedBrand = params['brand'] || '';
      this.selectedFilters = params['filters'] ? params['filters'].split(',') : []; 
      this.filterProducts(); 

      if (this.selectedCategory && selectedBrand) {
        this.filterProductsByCategoryAndBrand(this.selectedCategory, selectedBrand);
      }else {
        this.filterProducts(); // Handle general search or no filter
      }
    });
   
    
  }

  loadProducts(): void {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
      this.products.forEach(product => {
        product.price = Number(product.price.replace(/[^\d.-]/g, '')); // Ensure price is a number
        product.showFullDescription = false;
        this.categories.add(product.category); // Add category to the set
        if (!this.categorizedProducts[product.category]) {
          this.categorizedProducts[product.category] = [];
        }
        this.categorizedProducts[product.category].push(product); // Group by category
      });
    }
  }

  
  //  filterProducts(): void {
  //    if (this.searchQuery.trim()) {
  //      const lowerQuery = this.searchQuery.toLowerCase();
  //      this.filteredProducts = this.products.filter(product =>
  //        product.name.toLowerCase().includes(lowerQuery) ||
  //        product.category.toLowerCase().includes(lowerQuery) ||
  //        product.subcategory?.toLowerCase().includes(lowerQuery) || 
  //        product.brand?.toLowerCase().includes(lowerQuery)
  //      );
  //      this.showCategories = false; // Hide categories during search
  //    } else {
  //      this.filteredProducts = [...this.products]; 
  //      this.showCategories = true; 
  //    }
  //  }


  filterProducts(): void {
    if (this.searchQuery.trim()) {
      const lowerQuery = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.subcategory?.toLowerCase().includes(lowerQuery) ||
        product.brand?.toLowerCase().includes(lowerQuery)
      );
      this.showCategories = false; // Hide categories during search
    } else {
      this.filteredProducts = [...this.products];
      this.showCategories = true; 
    }
  
    // Apply price range filters
    if (this.selectedFilters.length > 0) {
      this.filteredProducts = this.filteredProducts.filter(product => {
        return this.selectedFilters.some(filter => {
          const [minStr, maxStr] = filter.split('-');
          const min = parseInt(minStr, 10);
          const max = maxStr === 'above' ? Infinity : parseInt(maxStr, 10);
          return product.price >= min && product.price <= max;
        });
      });
    }
  }
  
   

 
  toggleDescription(product: any, event: Event): void 
  { 
    product.showFullDescription = !product.showFullDescription; event.preventDefault(); 
  }

   // View product details in a modal
   viewProductDetails(product: any): void {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }
  
// Close modal
closeModal(event?: Event): void {
  if (event) {
    event.stopPropagation(); // Prevent click inside modal from closing it
  }
  this.isModalOpen = false;
}


 // Method to handle category selection
 onCategorySelected(category: string): void {
  this.selectedCategory = category;  // Update selected category
}

// Filter products based on the selected category
getFilteredProducts(): any[] {
  if (this.selectedCategory) {
    return this.categorizedProducts[this.selectedCategory] || [];
  }
 // return []; // If no category selected, return empty
 return this.products; // After search, return all products without categorization
}


addToCart(product: any) {
  this.cart.push(product); // Add product to the cart
  this.updateLocalStorage(); // Update cart data in localStorage
}

openCartModal(): void {
  this.isCartModalOpen = true;
}

// Remove product from the cart
removeFromCart(product: any) {
  const index = this.cart.indexOf(product);
  if (index > -1) {
    this.cart.splice(index, 1); // Remove the product from the cart
    this.updateLocalStorage(); // Update cart data in localStorage
  }
}

// View cart details
viewCartDetails(): any[] {
  return this.cart;
}

saveCart(): void { 
  localStorage.setItem('cart', JSON.stringify(this.cart)); 
}
closeCartModal() {
  this.isCartModalOpen = false; // Close the cart modal
}
updateLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(this.cart));
}


loadCart(): void { 
  const savedCart = localStorage.getItem('cart'); 
  if (savedCart) { this.cart = JSON.parse(savedCart); 
  } 
}
getKeys(obj: any): string[] {
  return Object.keys(obj);
}

 filterProductsByCategoryAndBrand(category: string, brand: string): void 
{
  this.filteredProducts = this.products.filter(product =>
   {
    const matchesCategory = category ? product.category === category : true;
    const matchesBrand = brand ? product.brand === brand : true;
    return matchesCategory && matchesBrand;
  });

  this.showCategories = false; // Hide categories when filtering
  console.log('Filtering for category:', category, 'and brand:', brand);
 }


}
