import { Component } from '@angular/core';
import { PageContentComponent } from '../../shared/page-content/page-content.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [PageContentComponent],
    templateUrl: './products.component.html'
})
export class ProductsComponent {
}
