import { Component, EventEmitter, Output,OnInit  } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit
{
toggleCategoryFilter() {
throw new Error('Method not implemented.');
}
  isLoggedIn$ = this.authService.isLoggedIn$;
  username: string | null = ''; 
  email: string | null = '';
  searchQuery: string = '';
  sidebarOpen: boolean = false; // Sidebar visibility state
  categories: string[] = [];
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  brands: string[] = [];
  products: any[] = [];
 
 selectedFilters: Set<string> = new Set(); // Store selected filters

  
  ngOnInit(): void {
    // Ensure navbar state reflects the login status
    this.authService.setLoggedIn(this.authService.isUserLoggedIn());

    this.isLoggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        this.username = user.name || 'User';
        this.email = user.email || '';
      } else {
        this.username = null;
        this.email = null;
      }
    });
  }

  @Output() categorySelected = new EventEmitter<string>();  // Emit category selection event

  // Object to track expanded categories
  expandedCategories: { [key: string]: boolean } = {};

  constructor(private router:Router,private authService: AuthService, private eRef: ElementRef) {
    this.loadCategories();
    
  }

// Determines if the second sidebar (brands) should be visible
get isBrandSidebarVisible(): boolean {
  return this.brands.length > 0;
}

  // Method to toggle the sidebar
  toggleSidebar(): void {
    if (!this.authService.isUserLoggedIn()) {
      alert('Please log in to access categories.');
      this.router.navigate(['/login']);
    } 
    else
    {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }
  

  // Load categories from localStorage
  loadCategories(): void {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const categorySet = new Set<string>();

    products.forEach((product: any) => {
      categorySet.add(product.category);
    });

    this.categories = Array.from(categorySet);
  }

  // Method to check if a category is expanded
  isCategoryExpanded(category: string): boolean {
    return this.expandedCategories[category] || false; // Return true if expanded, false otherwise
  }

  // Toggle category expansion
   // Logic for toggling subcategories
   toggleSubcategories(category: string): void {
    if (this.selectedCategory === category) {
      this.selectedCategory = '';
      this.brands = [];
    } else {
      this.selectedCategory = category;
      this.brands = this.getBrandsForCategory(category);
    }
    this.selectedSubcategory = '';
  }


  // Get subcategories for a category
  getSubcategories(category: string): string[] {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const subcategoriesSet = new Set<string>();

    products.forEach((product: any) => {
      if (product.category === category && product.subcategory) {
        subcategoriesSet.add(product.subcategory);
      }
    });

    return Array.from(subcategoriesSet);
  }

  // Get brands for the selected category
  getBrandsForCategory(category: string): string[] {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const brandsSet = new Set<string>();

    products.forEach((product: any) => {
      if (product.category === category && !product.subcategory) {
        brandsSet.add(product.brand);
      }
    });

    return Array.from(brandsSet);
  }


  isCollapsed = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  
  // Get brands for the selected subcategory
  getBrandsForSubcategory(subcategory: string): string[] {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const brandsSet = new Set<string>();

    products.forEach((product: any) => {
      if (product.subcategory === subcategory) {
        brandsSet.add(product.brand);
      }
    });

    return Array.from(brandsSet);
  }

   toggleBrandsForCategory(category: string): void {
    if (this.selectedCategory === category) {
      this.selectedCategory = '';
      this.brands = [];
    } else {
      this.selectedCategory = category;
      this.brands = this.getBrandsForCategory(category);
      
    }
    this.selectedSubcategory = '';
  }


 // Toggle brand display for subcategory
  toggleBrands(subcategory: string): void {
    if (this.selectedSubcategory === subcategory) {
      this.selectedSubcategory = '';
      this.brands = this.getBrandsForCategory(this.selectedCategory);
    } else {
      this.selectedSubcategory = subcategory;
      this.brands = this.getBrandsForSubcategory(subcategory);
    }
  }



  // Check if the category has subcategories
  hasSubcategories(category: string): boolean {
    const subcategories = this.getSubcategories(category);
    return subcategories.length > 0; // Return true if there are subcategories
  }

  // Emit category click
  onCategoryClick(category: string): void {
    this.categorySelected.emit(category);  // Emit category to parent component
    this.router.navigate(['/products'], { queryParams: { category } });
  }

  // @Output() searchEvent = new EventEmitter<string>();

  // onSearch(query: string): void {
  //   if (query.trim()) {
  //     this.searchEvent.emit(query);
  //     this.router.navigate(['/products'],
  //        { queryParams: { search: query } });
  //   }
  // }

  onSearch(query: string): void {
    this.router.navigate([], {
      queryParams: { search: query },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }
 
  

  logout()
  { 
    console.log('Logout triggered');
    localStorage.removeItem('loggedInUser');
     this.router.navigate(['/home']);
     }

     @HostListener('document:click', ['$event'])
     onDocumentClick(event: MouseEvent): void {
       const clickedInside = this.eRef.nativeElement.contains(event.target);
       if (!clickedInside && this.sidebarOpen) {
         this.sidebarOpen = false;
       }
     }



onFilterChange(event: any): void {
   const filterValue = event.target.value; 
   if (event.target.checked) { 
    this.selectedFilters.add(filterValue); 
  } else { 
    this.selectedFilters.delete(filterValue); 
  } this.applyFilters(); 
} 

applyFilters(): void { 
  this.router.navigate(['/products'],
     { 
      queryParams: { filters: Array.from(this.selectedFilters).join(',')
      }, 
     queryParamsHandling: 'merge', });
     }


              // Emit brand click
onBrandClick(brand: string): void {
  this.router.navigate(['/products'], {
    queryParams: { category: this.selectedCategory, brand }
  });
}
}