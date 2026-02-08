import { Component, inject, input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CenteredGridBoxesComponent } from '../centered-grid-boxes/centered-grid-boxes.component';
import { AtomGreyBoxComponent } from '../atom-grey-box/atom-grey-box.component';
import { AtomBadgeComponent } from '../atom-badge/atom-badge.component';
import { AnimalCategorySelectComponent } from '../animal-category-select/animal-category-select.component';
import { ManufacturerSelectComponent } from '../manufacturer-select/manufacturer-select.component';
import { CenteredLoaderComponent } from '../centered-loader/centered-loader.component';
import { ProductService, Product } from '../../core/services/product.service';
import { AnimalCategoryService, AnimalCategory } from '../../core/services/animal-category.service';
import { ManufacturerService, Manufacturer } from '../../core/services/manufacturer.service';

export interface ProductBoxItem {
    title: string;
    body: string;
    routerLink?: string | null;
    animalCategories?: Array<{ name: string; slug: string }>;
}

@Component({
    selector: 'app-products-centered-grid',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        CenteredGridBoxesComponent,
        AtomGreyBoxComponent,
        AtomBadgeComponent,
        AnimalCategorySelectComponent,
        ManufacturerSelectComponent,
        CenteredLoaderComponent
    ],
    template: `
        @if (loading()) {
            <app-centered-loader label="Ładowanie produktów..." />
        } @else if (products().length === 0) {
            <p class="text-surface-600 dark:text-surface-300">Brak produktów</p>
        } @else {
            <app-centered-grid-boxes [title]="title()" [subtitle]="subtitle()">
                @if (!hideFilters()) {
                    <div slot="above" class="mb-6">
                        <app-atom-grey-box title="Filtry" [useBackground]="false">
                            <div class="flex flex-row flex-wrap gap-4">
                                <div class="w-full md:w-auto flex-none">
                                    <app-animal-category-select
                                        [options]="animalCategories()"
                                        [selectedSlug]="selectedCategorySlug()"
                                        (selectedSlugChange)="onCategoryChange($event)" />
                                </div>
                                <div class="w-full md:w-auto flex-none">
                                    <app-manufacturer-select
                                        [options]="manufacturers()"
                                        [selectedSlug]="selectedManufacturerSlug()"
                                        (selectedSlugChange)="onManufacturerChange($event)" />
                                </div>
                            </div>
                        </app-atom-grey-box>
                    </div>
                }
                @for (item of productItems(); track item.title) {
                    <app-atom-grey-box [title]="item.title">
                        <p slot="body" class="text-surface-600 dark:text-surface-400 text-base leading-normal">{{ item.body }}</p>
                        @if (item.animalCategories && item.animalCategories.length > 0) {
                            <div slot="top" class="flex flex-wrap gap-2 mb-3">
                                @for (cat of item.animalCategories; track cat.slug) {
                                    <app-atom-badge variant="category" [label]="cat.name" [routerLink]="'/produkty/' + cat.slug" />
                                }
                            </div>
                        }
                        <div slot="buttons" class="mt-4">
                            <a [routerLink]="item.routerLink!" class="inline-block px-4 py-2 rounded-lg bg-surface-700 text-white hover:bg-surface-800 dark:bg-surface-500 dark:hover:bg-surface-400 transition-colors text-sm font-medium">
                                Więcej
                            </a>
                        </div>
                    </app-atom-grey-box>
                }
            </app-centered-grid-boxes>
        }
    `
})
export class ProductsCenteredGridComponent implements OnInit, OnDestroy {
    title = input.required<string>();
    subtitle = input.required<string>();
    productsLimit = input<number | null>(null);
    hideFilters = input<boolean>(false);

    private productService = inject(ProductService);
    private animalCategoryService = inject(AnimalCategoryService);
    private manufacturerService = inject(ManufacturerService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private routeSubscription?: Subscription;

    products = signal<Product[]>([]);
    animalCategories = signal<AnimalCategory[]>([]);
    manufacturers = signal<Manufacturer[]>([]);
    selectedCategorySlug = signal<string | null>(null);
    selectedManufacturerSlug = signal<string | null>(null);
    loading = signal(true);

    productItems = computed<ProductBoxItem[]>(() => {
        const categorySlug = this.selectedCategorySlug();
        const manufacturerSlug = this.selectedManufacturerSlug();
        const limit = this.productsLimit();
        const allProducts = this.products();
        
        let filteredProducts = allProducts;

        // Filter by category if selected
        if (categorySlug) {
            filteredProducts = filteredProducts.filter(product => 
                product.animalCategories?.some(cat => cat.slug === categorySlug)
            );
        }

        // Filter by manufacturer if selected
        if (manufacturerSlug) {
            filteredProducts = filteredProducts.filter(product =>
                product.manufacturer?.slug === manufacturerSlug
            );
        }

        // Apply limit if set
        if (limit !== null && limit > 0) {
            filteredProducts = filteredProducts.slice(0, limit);
        }

        return filteredProducts.map(product => {
            return {
                title: product.name,
                body: this.extractDescription(product.description),
                routerLink: `/produkt/${product.slug}`,
                animalCategories: product.animalCategories
            };
        });
    });

    ngOnInit(): void {
        // Only handle route params if filters are visible
        if (!this.hideFilters()) {
            // Read initial categorySlug from route
            const slug = this.route.snapshot.paramMap.get('categorySlug');
            this.selectedCategorySlug.set(slug);

            // Subscribe to route param changes (for browser back/forward)
            this.routeSubscription = this.route.paramMap.subscribe(params => {
                const categorySlug = params.get('categorySlug');
                this.selectedCategorySlug.set(categorySlug);
            });

            this.loadAnimalCategories();
            this.loadManufacturers();
        }

        this.loadProducts();
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    onCategoryChange(slug: string | null): void {
        // Update URL when user changes selection (only if filters are visible)
        if (!this.hideFilters()) {
            if (slug === null) {
                this.router.navigate(['/produkty'], { replaceUrl: false });
            } else {
                this.router.navigate(['/produkty', slug], { replaceUrl: false });
            }
        } else {
            // If filters are hidden, just update the signal for filtering
            this.selectedCategorySlug.set(slug);
        }
    }

    onManufacturerChange(slug: string | null): void {
        this.selectedManufacturerSlug.set(slug);
    }

    private loadAnimalCategories(): void {
        this.animalCategoryService.getAnimalCategories().subscribe({
            next: (response) => {
                this.animalCategories.set(response.data);
            },
            error: (err) => {
                console.error('Error loading animal categories:', err);
            }
        });
    }

    private loadManufacturers(): void {
        this.manufacturerService.getManufacturers().subscribe({
            next: (response) => {
                this.manufacturers.set(response.data);
            },
            error: (err) => {
                console.error('Error loading manufacturers:', err);
            }
        });
    }

    private loadProducts(): void {
        this.productService.getProducts().subscribe({
            next: (response) => {
                this.products.set(response.data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading products:', err);
                this.loading.set(false);
            }
        });
    }

    private extractDescription(description: unknown): string {
        if (!description) {
            return '';
        }

        // If description is already a string, strip HTML tags and return
        if (typeof description === 'string') {
            return description.replace(/<[^>]*>/g, '').trim();
        }

        // If description is an object (richtext from Strapi), extract text content
        if (typeof description === 'object' && description !== null) {
            try {
                // Strapi richtext format: { type: 'doc', content: [...] }
                const descObj = description as Record<string, unknown>;
                
                // Try to extract text from richtext structure recursively
                const extractTextFromNode = (node: unknown): string => {
                    if (typeof node === 'string') {
                        return node;
                    }
                    if (typeof node === 'object' && node !== null) {
                        const obj = node as Record<string, unknown>;
                        // Check for text property
                        if (typeof obj['text'] === 'string') {
                            return obj['text'] as string;
                        }
                        // Check for content array and recursively extract
                        if (Array.isArray(obj['content'])) {
                            return (obj['content'] as unknown[]).map(extractTextFromNode).join(' ');
                        }
                    }
                    return '';
                };

                const text = extractTextFromNode(descObj);
                if (text) {
                    return text.trim();
                }

                // Fallback: try to stringify and extract any text-like content
                const descStr = JSON.stringify(description);
                // Remove JSON structure and extract text between quotes
                const textMatches = descStr.match(/"text":"([^"]+)"/g);
                if (textMatches && textMatches.length > 0) {
                    return textMatches.map(m => m.match(/"text":"([^"]+)"/)?.[1] || '').join(' ').trim();
                }
            } catch (e) {
                console.warn('Error extracting description:', e);
            }
        }

        return '';
    }
}
