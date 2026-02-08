import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../core/services/product.service';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { AtomGreyBoxComponent } from '../../shared/atom-grey-box/atom-grey-box.component';
import { GalleryComponent } from '../../shared/gallery/gallery.component';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, PageContentComponent, AtomGreyBoxComponent, GalleryComponent],
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

    getGalleryUrls(prod: Product): string[] {
        return prod.gallery?.map(g => g.url).filter(Boolean) ?? [];
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
