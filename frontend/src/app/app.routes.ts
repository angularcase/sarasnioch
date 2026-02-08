import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ArticleComponent } from './pages/article/article.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductComponent } from './pages/product/product.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'artykuly',
        component: ArticlesComponent
    },
    {
        path: 'artykuly/:categorySlug',
        component: ArticlesComponent
    },
    {
        path: 'artykul/:slug',
        component: ArticleComponent
    },
    {
        path: 'produkty',
        component: ProductsComponent
    },
    {
        path: 'produkt/:slug',
        component: ProductComponent
    },
    {
        path: 'kontakt',
        component: ContactComponent
    }
];
