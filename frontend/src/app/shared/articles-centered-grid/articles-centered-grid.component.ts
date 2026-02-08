import { Component, inject, input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CenteredGridBoxesComponent } from '../centered-grid-boxes/centered-grid-boxes.component';
import { AtomGreyBoxComponent } from '../atom-grey-box/atom-grey-box.component';
import { AtomBadgeComponent } from '../atom-badge/atom-badge.component';
import { AnimalCategorySelectComponent } from '../animal-category-select/animal-category-select.component';
import { ProductSelectComponent } from '../product-select/product-select.component';
import { CenteredLoaderComponent } from '../centered-loader/centered-loader.component';
import { ArticleService, Article } from '../../core/services/article.service';
import { AnimalCategoryService, AnimalCategory } from '../../core/services/animal-category.service';
import { ProductService, Product } from '../../core/services/product.service';

export interface ArticleBoxItem {
    title: string;
    body: string;
    routerLink?: string | null;
    publishedAt?: string | null;
    author?: string | null;
    animalCategories?: Array<{ name: string; slug: string }>;
    products?: Array<{ name: string; slug: string }>;
}

@Component({
    selector: 'app-articles-centered-grid',
    standalone: true,
    imports: [
        CommonModule,
        DatePipe,
        RouterLink,
        CenteredGridBoxesComponent,
        AtomGreyBoxComponent,
        AtomBadgeComponent,
        AnimalCategorySelectComponent,
        ProductSelectComponent,
        CenteredLoaderComponent
    ],
    template: `
        @if (loading()) {
            <app-centered-loader label="Ładowanie artykułów..." />
        } @else if (articles().length === 0) {
            <p class="text-surface-600 dark:text-surface-300">Brak artykułów</p>
        } @else {
            <app-centered-grid-boxes [title]="title()" [subtitle]="subtitle()">
                @if (!hideFilters()) {
                    <div slot="above" class="mb-6">
                        <app-atom-grey-box title="Filtry" variant="green">
                            <div class="flex flex-row flex-wrap gap-4">
                                <div class="w-full md:w-auto flex-none">
                                    <app-animal-category-select
                                        [options]="animalCategories()"
                                        [selectedSlug]="selectedCategorySlug()"
                                        (selectedSlugChange)="onCategoryChange($event)" />
                                </div>
                                <div class="w-full md:w-auto flex-none">
                                    <app-product-select
                                        [options]="products()"
                                        [selectedSlug]="selectedProductSlug()"
                                        (selectedSlugChange)="onProductChange($event)" />
                                </div>
                            </div>
                        </app-atom-grey-box>
                    </div>
                }
                @for (item of articleItems(); track item.title) {
                    <app-atom-grey-box [title]="item.title">
                        <p slot="body" class="text-surface-600 dark:text-surface-400 text-base leading-normal">{{ item.body }}</p>
                        @if (item.animalCategories && item.animalCategories.length > 0) {
                            <div slot="top" class="flex flex-wrap gap-2 mb-3">
                                @for (cat of item.animalCategories; track cat.slug) {
                                    <app-atom-badge variant="category" [label]="cat.name" [routerLink]="'/artykuly/' + cat.slug" />
                                }
                            </div>
                        }
                        @if (item.publishedAt || item.author) {
                            <div slot="subtitle" class="text-sm text-surface-500 dark:text-surface-400 mb-3">
                                {{ item.publishedAt ? (item.publishedAt | date:'d.MM.yyyy') : '' }}{{ item.publishedAt && item.author ? ' · ' : '' }}{{ item.author ?? '' }}
                            </div>
                        }
                        @if (item.products && item.products.length > 0) {
                            <div slot="bottom" class="flex flex-wrap gap-2 mt-3">
                                @for (prod of item.products; track prod.slug) {
                                    <app-atom-badge variant="product" [label]="prod.name" [routerLink]="'/produkt/' + prod.slug" />
                                }
                            </div>
                        }
                        <div slot="buttons" class="mt-4">
                            <a [routerLink]="item.routerLink!" class="inline-block px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors text-sm font-medium">
                                Więcej
                            </a>
                        </div>
                    </app-atom-grey-box>
                }
            </app-centered-grid-boxes>
        }
    `
})
export class ArticlesCenteredGridComponent implements OnInit, OnDestroy {
    title = input.required<string>();
    subtitle = input.required<string>();
    articlesLimit = input<number | null>(null);
    hideFilters = input<boolean>(false);

    private articleService = inject(ArticleService);
    private animalCategoryService = inject(AnimalCategoryService);
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private routeSubscription?: Subscription;

    articles = signal<Article[]>([]);
    animalCategories = signal<AnimalCategory[]>([]);
    products = signal<Product[]>([]);
    selectedCategorySlug = signal<string | null>(null);
    selectedProductSlug = signal<string | null>(null);
    loading = signal(true);

    articleItems = computed<ArticleBoxItem[]>(() => {
        const categorySlug = this.selectedCategorySlug();
        const productSlug = this.selectedProductSlug();
        const limit = this.articlesLimit();
        const allArticles = this.articles();
        
        let filteredArticles = allArticles;

        // Filter by category if selected
        if (categorySlug) {
            filteredArticles = filteredArticles.filter(article => 
                article.animalCategories?.some(cat => cat.slug === categorySlug)
            );
        }

        // Filter by product if selected
        if (productSlug) {
            filteredArticles = filteredArticles.filter(article =>
                article.products?.some(product => product.slug === productSlug)
            );
        }

        // Apply limit if set
        if (limit !== null && limit > 0) {
            filteredArticles = filteredArticles.slice(0, limit);
        }

        return filteredArticles.map(article => {
            const products = article.products?.map(p => ({ name: p.name, slug: p.slug })) ?? [];
            
            return {
                title: article.title,
                body: this.extractExcerpt(article.content, 150),
                routerLink: `/artykul/${article.slug}`,
                publishedAt: article.publishedAt,
                author: article.author,
                animalCategories: article.animalCategories,
                products
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
            this.loadProducts();
        }

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

    private loadProducts(): void {
        this.productService.getProducts().subscribe({
            next: (response) => {
                this.products.set(response.data);
            },
            error: (err) => {
                console.error('Error loading products:', err);
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
        // Update URL when user changes selection (only if filters are visible)
        if (!this.hideFilters()) {
            if (slug === null) {
                this.router.navigate(['/artykuly'], { replaceUrl: false });
            } else {
                this.router.navigate(['/artykuly', slug], { replaceUrl: false });
            }
        } else {
            // If filters are hidden, just update the signal for filtering
            this.selectedCategorySlug.set(slug);
        }
    }

    onProductChange(slug: string | null): void {
        this.selectedProductSlug.set(slug);
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
