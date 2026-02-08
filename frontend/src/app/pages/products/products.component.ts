import { Component } from '@angular/core';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { ProductsCenteredGridComponent } from '../../shared/products-centered-grid/products-centered-grid.component';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [PageContentComponent, ProductsCenteredGridComponent],
    templateUrl: './products.component.html'
})
export class ProductsComponent {
    breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Produkty' }
    ];

    productsSectionTitle = 'Produkty weterynaryjne';
    productsSectionSubtitle =
        'Sprawdzone produkty oparte na naturalnych składnikach dla zdrowia zwierząt.';
}
