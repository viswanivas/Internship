import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  filteredProducts: any[] = [];
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  products: any[] = [];
  selectedBrand:string='';
  selectedProduct: any = null;
  isModalOpen: boolean = false;
  selectedSubcategoryLevel: string = ''; // Tracks subcategory level for nested categories (like Accessories, Wearables)

  openCategory: string = ''; // Track open category
  openSubcategory: string = ''; // Track open subcategory for Accessories and Wearables

  // Track available brands for each category
  availableBrands: { [category: string]: string[] } = {
    SmartPhones: [],
    Tablets: [],
    Laptops: [],
    Wearables: [],
    Accessories: []
  };


  ngOnInit() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
      this.filteredProducts = [...this.products]; // Display all products initially
      this.initializeBrands();
      this.products.forEach(product => product.showFullDescription = false);
    }
  }

 // Extract unique brands for each category
 initializeBrands(): void {
  // Group products by category
  const categories = ['SmartPhones', 'Tablets', 'Laptops', 'Wearables', 'Accessories'];

  categories.forEach(category => {
    const brands = this.products
      .filter(product => product.category === category)
      .map(product => product.brand);

    // Remove duplicates by converting to Set and back to array
    this.availableBrands[category] = Array.from(new Set(brands));
  });
}

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.selectedSubcategory = '';
    this.selectedSubcategoryLevel = '';
  this.openSubcategory = ''; // Reset subcategory when changing category
  
    // If the category has subcategories (like Accessories, Wearables), show them
    if (category === 'Accessories' || category === 'Wearables') {
      this.filterProducts(); // Show all products for the selected category
    } else {
      this.filterProducts(); // Directly filter products by the selected category
    }
  }
  

//5
selectSubcategory(category: string, subcategory: string): void {
  this.selectedCategory = category;
  this.selectedSubcategory = subcategory;
this.openSubcategory = this.openSubcategory === subcategory ? '' : subcategory;

  // Set subcategory level to show brands for Accessories and Wearables
  if (category === 'Accessories' || category === 'Wearables') {
    this.selectedSubcategoryLevel = subcategory;

    // Fetch brands for the selected subcategory
    const brands = this.products
      .filter(product => product.category === category && product.subcategory === subcategory)
      .map(product => product.brand);

    // Remove duplicates and update available brands
    this.availableBrands[category] = Array.from(new Set(brands));
  }

  this.filterProducts();
}

//3
filterProducts(): void {
  let filtered = this.products;

  // Filter by category
  if (this.selectedCategory && this.selectedCategory !== 'All') {
    filtered = filtered.filter(product => product.category === this.selectedCategory);
  }

  // Filter by subcategory (brand), if any
  if (this.selectedSubcategory) {
    filtered = filtered.filter(product => product.brand === this.selectedSubcategory);
  }

  this.filteredProducts = filtered;
}




  // Toggle category dropdown visibility
  toggleCategory(category: string): void {
    this.openCategory = this.openCategory === category ? '' : category;
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


  // Method to filter products based on search term
  searchProducts(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredProducts = [...this.products];  // Show all products if search term is empty
      return;
    }

    this.filteredProducts = this.products.filter(product => {
      const { name, brand, category, subcategory } = product;
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brand && brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category && category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subcategory && subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    // Show an alert if no products match the search
    if (this.filteredProducts.length === 0) {
      alert('No products found!');
    }
  }

  resetFilters(): void {
    this.selectedCategory = 'All';
    this.selectedSubcategory = '';
    this.filterProducts();
  }
  
  filterByBrand(brand: string): void {
    this.selectedBrand = brand;
    this.filteredProducts = this.products.filter(product =>
      product.category === this.selectedCategory &&
      product.subcategory === this.selectedSubcategoryLevel &&
      product.brand === brand
    );
  }
  
  

}
