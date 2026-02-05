import { Component } from '@angular/core';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [PageContentComponent],
    templateUrl: './products.component.html'
})
export class ProductsComponent {
    breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Produkty' }
    ];
}
