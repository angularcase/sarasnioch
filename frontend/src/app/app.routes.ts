import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ProductsComponent } from './pages/products/products.component';
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
        path: 'produkty',
        component: ProductsComponent
    },
    {
        path: 'kontakt',
        component: ContactComponent
    }
];
