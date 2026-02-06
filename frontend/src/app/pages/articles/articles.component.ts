import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { CenteredGridBoxesComponent, GreyBoxItem } from '../../shared/centered-grid-boxes/centered-grid-boxes.component';
import { ArticleService, Article } from '../../core/services/article.service';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [CommonModule, PageContentComponent, CenteredGridBoxesComponent],
    templateUrl: './articles.component.html'
})
export class ArticlesComponent implements OnInit {
    private articleService = inject(ArticleService);

    articles = signal<Article[]>([]);
    loading = signal(true);
    breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Artykuły' }
    ];

    articleItems = computed<GreyBoxItem[]>(() => {
        return this.articles().map(article => ({
            title: article.title,
            body: this.extractExcerpt(article.content, 150),
            routerLink: `/artykul/${article.slug}`
        }));
    });

    ngOnInit(): void {
        this.loadArticles();
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
