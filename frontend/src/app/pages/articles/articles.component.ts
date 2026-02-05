import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { ArticleService, Article } from '../../core/services/article.service';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [CommonModule, PageContentComponent, RouterLink, DatePipe],
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
}
