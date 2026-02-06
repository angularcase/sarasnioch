import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { CenteredLoaderComponent } from '../../shared/centered-loader/centered-loader.component';
import { CenteredGridBoxesComponent, GreyBoxItem } from '../../shared/centered-grid-boxes/centered-grid-boxes.component';
import { AnimalCategorySelectComponent } from '../../shared/animal-category-select/animal-category-select.component';
import { ManufacturerSelectComponent } from '../../shared/manufacturer-select/manufacturer-select.component';
import { AtomGreyBoxComponent } from '../../shared/atom-grey-box/atom-grey-box.component';
import { ArticleService, Article } from '../../core/services/article.service';
import { AnimalCategoryService, AnimalCategory } from '../../core/services/animal-category.service';
import { ManufacturerService, Manufacturer } from '../../core/services/manufacturer.service';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [CommonModule, PageContentComponent, CenteredLoaderComponent, CenteredGridBoxesComponent, AnimalCategorySelectComponent, ManufacturerSelectComponent, AtomGreyBoxComponent],
    templateUrl: './articles.component.html'
})
export class ArticlesComponent implements OnInit, OnDestroy {
    private articleService = inject(ArticleService);
    private animalCategoryService = inject(AnimalCategoryService);
    private manufacturerService = inject(ManufacturerService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private routeSubscription?: Subscription;

    articles = signal<Article[]>([]);
    animalCategories = signal<AnimalCategory[]>([]);
    manufacturers = signal<Manufacturer[]>([]);
    selectedCategorySlug = signal<string | null>(null);
    selectedManufacturerSlug = signal<string | null>(null);
    loading = signal(true);
    breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Artykuły' }
    ];

    pageTitle = computed<string>(() => {
        const categorySlug = this.selectedCategorySlug();
        if (categorySlug) {
            const category = this.animalCategories().find(cat => cat.slug === categorySlug);
            return category ? `Artykuły - ${category.name}` : 'Artykuły';
        }
        return 'Lista artykułów';
    });

    articleItems = computed<GreyBoxItem[]>(() => {
        const categorySlug = this.selectedCategorySlug();
        const manufacturerSlug = this.selectedManufacturerSlug();
        const allArticles = this.articles();
        
        let filteredArticles = allArticles;

        // Filter by category if selected
        if (categorySlug) {
            filteredArticles = filteredArticles.filter(article => 
                article.animalCategories?.some(cat => cat.slug === categorySlug)
            );
        }

        // Filter by manufacturer if selected (through products)
        if (manufacturerSlug) {
            filteredArticles = filteredArticles.filter(article =>
                article.products?.some(product => product.manufacturer?.slug === manufacturerSlug)
            );
        }

        return filteredArticles.map(article => ({
            title: article.title,
            body: this.extractExcerpt(article.content, 150),
            routerLink: `/artykul/${article.slug}`
        }));
    });

    ngOnInit(): void {
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
        this.loadArticles();
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

    private loadArticles(): void {
        this.articleService.getArticles().subscribe({
            next: (response) => {
                this.articles.set(response.data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading articles:', err);
                this.loading.set(false);
            }
        });
    }

    onCategoryChange(slug: string | null): void {
        // Update URL when user changes selection
        if (slug === null) {
            this.router.navigate(['/artykuly'], { replaceUrl: false });
        } else {
            this.router.navigate(['/artykuly', slug], { replaceUrl: false });
        }
    }

    onManufacturerChange(slug: string | null): void {
        // Update manufacturer filter (no URL change)
        this.selectedManufacturerSlug.set(slug);
    }

    private extractExcerpt(htmlContent: string, maxLength: number): string {
        // Strip HTML tags
        const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
        
        // If content is shorter than maxLength, return as is
        if (textContent.length <= maxLength) {
            return textContent;
        }
        
        // Find the last space before maxLength to avoid cutting words
        const truncated = textContent.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        if (lastSpace > 0) {
            return truncated.substring(0, lastSpace) + '...';
        }
        
        return truncated + '...';
    }
}
