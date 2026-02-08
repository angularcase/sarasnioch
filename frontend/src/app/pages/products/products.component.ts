import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { ProductsCenteredGridComponent } from '../../shared/products-centered-grid/products-centered-grid.component';
import { AnimalCategoryService, AnimalCategory } from '../../core/services/animal-category.service';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, PageContentComponent, ProductsCenteredGridComponent],
    templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, OnDestroy {
    private animalCategoryService = inject(AnimalCategoryService);
    private route = inject(ActivatedRoute);
    private routeSubscription?: Subscription;

    animalCategories = signal<AnimalCategory[]>([]);
    selectedCategorySlug = signal<string | null>(null);

    productsSectionTitle = 'Produkty weterynaryjne';
    productsSectionSubtitle =
        'Sprawdzone produkty oparte na naturalnych składnikach dla zdrowia zwierząt.';

    breadcrumbs = computed<BreadcrumbItem[]>(() => {
        const categorySlug = this.selectedCategorySlug();
        const baseBreadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', route: '/' },
            { label: 'Produkty' }
        ];
        
        if (categorySlug) {
            const category = this.animalCategories().find(cat => cat.slug === categorySlug);
            if (category) {
                baseBreadcrumbs.push({ label: category.name });
            }
        }
        
        return baseBreadcrumbs;
    });

    ngOnInit(): void {
        // Read initial categorySlug from route for breadcrumbs
        const slug = this.route.snapshot.paramMap.get('categorySlug');
        this.selectedCategorySlug.set(slug);

        // Subscribe to route param changes (for browser back/forward) - only for breadcrumbs
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            const categorySlug = params.get('categorySlug');
            this.selectedCategorySlug.set(categorySlug);
        });

        // Load animal categories only for breadcrumbs
        this.loadAnimalCategories();
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
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
}
