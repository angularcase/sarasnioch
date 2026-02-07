import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenteredGridBoxesComponent, GreyBoxItem } from '../centered-grid-boxes/centered-grid-boxes.component';
import { ArticleService, Article } from '../../core/services/article.service';

@Component({
    selector: 'app-last-3-articles',
    standalone: true,
    imports: [CommonModule, CenteredGridBoxesComponent],
    template: `
        <app-centered-grid-boxes
            title="Najnowsze artykuły"
            subtitle="Najnowsze publikacje i materiały dotyczące produktów weterynaryjnych oraz praktyki klinicznej."
            [items]="articleItems()"
            [showSlot]="false" />
    `
})
export class Last3ArticlesComponent implements OnInit {
    private articleService = inject(ArticleService);

    articles = signal<Article[]>([]);

    articleItems = computed<GreyBoxItem[]>(() => {
        return this.articles()
            .slice(0, 3)
            .map((article) => ({
                title: article.title,
                body: this.extractExcerpt(article.content, 150),
                routerLink: `/artykul/${article.slug}`,
                publishedAt: article.publishedAt,
                author: article.author,
                animalCategories: article.animalCategories,
                products: article.products?.map((p) => ({ name: p.name, slug: p.slug })) ?? []
            }));
    });

    ngOnInit(): void {
        this.articleService.getArticles().subscribe({
            next: (response) => {
                this.articles.set(response.data);
            },
            error: (err) => {
                console.error('Error loading articles:', err);
            }
        });
    }

    private extractExcerpt(htmlContent: string, maxLength: number): string {
        const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
        if (textContent.length <= maxLength) {
            return textContent;
        }
        const truncated = textContent.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
    }
}
