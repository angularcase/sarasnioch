import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { CenteredLoaderComponent } from '../../shared/centered-loader/centered-loader.component';
import { CenteredGridBoxesComponent, GreyBoxItem } from '../../shared/centered-grid-boxes/centered-grid-boxes.component';
import { AnimalCategorySelectComponent } from '../../shared/animal-category-select/animal-category-select.component';
import { ProductSelectComponent } from '../../shared/product-select/product-select.component';
import { AtomGreyBoxComponent } from '../../shared/atom-grey-box/atom-grey-box.component';
import { ArticleService, Article } from '../../core/services/article.service';
import { AnimalCategoryService, AnimalCategory } from '../../core/services/animal-category.service';
import { ProductService, Product } from '../../core/services/product.service';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [CommonModule, PageContentComponent, CenteredLoaderComponent, CenteredGridBoxesComponent, AnimalCategorySelectComponent, ProductSelectComponent, AtomGreyBoxComponent],
    templateUrl: './articles.component.html'
})
export class ArticlesComponent implements OnInit, OnDestroy {
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

    articlesSectionTitle = 'Korzystaj z doświadczenia';
    articlesSectionSubtitle =
        'Publikacje i materiały dotyczące produktów weterynaryjnych oraz praktyki klinicznej.';

    breadcrumbs = computed<BreadcrumbItem[]>(() => {
        const categorySlug = this.selectedCategorySlug();
        const baseBreadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', route: '/' },
            { label: 'Artykuły' }
        ];
        
        if (categorySlug) {
            const category = this.animalCategories().find(cat => cat.slug === categorySlug);
            if (category) {
                baseBreadcrumbs.push({ label: category.name });
            }
        }
        
        return baseBreadcrumbs;
    });

    articleItems = computed<GreyBoxItem[]>(() => {
        const categorySlug = this.selectedCategorySlug();
        const productSlug = this.selectedProductSlug();
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
        // Update URL when user changes selection
        if (slug === null) {
            this.router.navigate(['/artykuly'], { replaceUrl: false });
        } else {
            this.router.navigate(['/artykuly', slug], { replaceUrl: false });
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
