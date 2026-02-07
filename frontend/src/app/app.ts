import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ArticleService } from './core/services/article.service';
import { MenuComponent } from './shared/menu/menu.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NewsletterComponent } from './shared/newsletter/newsletter.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, MenuComponent, NewsletterComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-app');
  private articleService = inject(ArticleService);

  loadArticles(): void {
    this.articleService.getArticles().subscribe({
      next: (response) => {
        console.log('Articles loaded:', response);
      },
      error: (error) => {
        console.error('Error loading articles:', error);
      }
    });
  }
}
