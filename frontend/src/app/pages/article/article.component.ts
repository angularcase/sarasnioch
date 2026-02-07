import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ArticleService, Article } from '../../core/services/article.service';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { AtomGreyBoxComponent } from '../../shared/atom-grey-box/atom-grey-box.component';
import { GalleryComponent } from '../../shared/gallery/gallery.component';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-article',
    standalone: true,
    imports: [CommonModule, TagModule, DatePipe, PageContentComponent, AtomGreyBoxComponent, GalleryComponent],
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private articleService = inject(ArticleService);

    article = signal<Article | null>(null);
    loading = signal(true);
    
    breadcrumbs = computed<BreadcrumbItem[]>(() => {
        const art = this.article();
        return [
            { label: 'Home', route: '/' },
            { label: 'Artykuły', route: '/artykuly' },
            { label: art?.title ?? 'Artykuł' }
        ];
    });

    ngOnInit(): void {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (slug) {
            this.loadArticle(slug);
        } else {
            this.router.navigate(['/']);
        }
    }

    getAuthorDisplay(art: Article): string {
        return (art.author?.trim() ?? '') || '—';
    }

    getGalleryUrls(art: Article): string[] {
        return art.gallery?.map(g => g.url).filter(Boolean) ?? [];
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
