import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
