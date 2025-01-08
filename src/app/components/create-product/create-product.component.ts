import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FooterComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {
  productForm: FormGroup; 

  categories: string[] = ['SmartPhones', 'Tablets', 'Laptops', 'Wearables', 'Accessories']; 
  subcategories: string[] = [];
  showSubcategory = false;

  constructor(private fb: FormBuilder) { 
    this.productForm = this.fb.group({ 
      image: ['', Validators.required], 
      name: ['', Validators.required], 
      description: ['', Validators.required], 
      category: ['', Validators.required], 
      subcategory: [''],
      price: ['', Validators.required], 
      brand: ['', Validators.required] });
     } 

     onCategoryChange(event: Event): void { 
      const selectedCategory = (event.target as HTMLSelectElement).value; 
      if (selectedCategory === 'Accessories') {
         this.subcategories = ['Chargers', 'Mobile Cases', 'Headphones', 'Connectors','PowerBanks']; 
         this.showSubcategory = true; 
        } 
         else if (selectedCategory === 'Wearables') { 
          this.subcategories = ['Fitness Bands', 'Smartwatches']; 
          this.showSubcategory = true; 
        } else { 
          this.showSubcategory = false;
           this.productForm.get('subcategory')?.setValue('');
           }
         }

     onSubmit() {
       if (this.productForm.valid) { 
        const productData = this.productForm.value; 
        let products = JSON.parse(localStorage.getItem('products') || '[]'); 
        if (!Array.isArray(products)) { 
          products = []; 
        } 
        products.push(productData); 
        localStorage.setItem('products', JSON.stringify(products)); 
        console.log('Product data stored:', productData); 
        alert('Product created successfully'); 
      } else { 
        console.log('Form is invalid');
      }
    }
}
