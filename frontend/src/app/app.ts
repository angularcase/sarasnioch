import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleService } from './core/services/article.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('my-app');
  private articleService = inject(ArticleService);

  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (response) => {
        console.log('Articles loaded:', {
          total: response.meta.pagination.total,
          articles: response.data.map(a => ({
            id: a.id,
            title: a.attributes.title,
            slug: a.attributes.slug
          }))
        });
      },
      error: (error) => {
        console.error('Error loading articles:', error);
      }
    });
  }
}
