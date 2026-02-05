import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ArticleService, Article } from '../../core/services/article.service';

@Component({
    selector: 'app-article',
    standalone: true,
    imports: [CommonModule, TagModule, DatePipe],
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private articleService = inject(ArticleService);

    article = signal<Article | null>(null);
    loading = signal(true);

    ngOnInit(): void {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (slug) {
            this.loadArticle(slug);
        } else {
            this.router.navigate(['/']);
        }
    }

    private loadArticle(slug: string): void {
        this.loading.set(true);
        this.articleService.getArticleBySlug(slug).subscribe({
            next: (response) => {
                if (response.data && response.data.length > 0) {
                    this.article.set(response.data[0]);
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
