import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../core/services/product.service';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { AtomGreyBoxComponent } from '../../shared/atom-grey-box/atom-grey-box.component';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, PageContentComponent, AtomGreyBoxComponent],
    templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(ProductService);

    product = signal<Product | null>(null);
    loading = signal(true);
    
    breadcrumbs = computed<BreadcrumbItem[]>(() => {
        const prod = this.product();
        return [
            { label: 'Home', route: '/' },
            { label: 'Produkty', route: '/produkty' },
            { label: prod?.name ?? 'Produkt' }
        ];
    });

    ngOnInit(): void {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (slug) {
            this.loadProduct(slug);
        } else {
            this.router.navigate(['/']);
        }
    }

    getManufacturerDisplay(prod: Product): string {
        if (prod.manufacturer) {
            const man = prod.manufacturer as unknown as Record<string, unknown>;
            const name = man['name'] as string | undefined;
            return name?.trim() ?? '—';
        }
        return '—';
    }

    getManufacturerDisplayWithIcon(prod: Product): string {
        const name = this.getManufacturerDisplay(prod);
        const website = this.getManufacturerWebsite(prod);
        
        if (website) {
            return `${name} <i class="pi pi-external-link text-sm ml-1"></i>`;
        }
        return name;
    }

    hasManufacturerWebsite(prod: Product): boolean {
        return this.getManufacturerWebsite(prod) !== null;
    }

    getManufacturerWebsite(prod: Product): string | null {
        if (prod.manufacturer) {
            const man = prod.manufacturer as unknown as Record<string, unknown>;
            const website = man['website'] as string | undefined;
            return website?.trim() || null;
        }
        return null;
    }

    getFirstImageUrl(prod: Product): string | null {
        if (prod.gallery && prod.gallery.length > 0) {
            return prod.gallery[0].url || null;
        }
        return null;
    }

    getDescriptionHtml(prod: Product): string {
        const desc = prod.description;
        if (!desc) {
            return '';
        }
        
        // If description is already a string (HTML), return it
        if (typeof desc === 'string') {
            return desc;
        }
        
        // If description is an object (richtext), convert to HTML
        // For now, return empty string - richtext conversion would need a library
        // Strapi should return HTML string when using populate or specific format
        return '';
    }

    private loadProduct(slug: string): void {
        this.loading.set(true);
        this.productService.getProductBySlug(slug).subscribe({
            next: (response) => {
                if (response.data && response.data.length > 0) {
                    this.product.set(response.data[0]);
                    this.loading.set(false);
                } else {
                    this.router.navigate(['/']);
                }
            },
            error: () => {
                this.router.navigate(['/']);
            }
        });
    }
}
