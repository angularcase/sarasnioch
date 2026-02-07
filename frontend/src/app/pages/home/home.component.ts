import { Component } from '@angular/core';
import { HeroButton, HeroFeature, HeroMarineWithButtonComponent } from '../../shared/hero-marine-with-button/hero-marine-with-button.component';
import { Last3ArticlesComponent } from '../../shared/last-3-articles/last-3-articles.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [HeroMarineWithButtonComponent, Last3ArticlesComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    heroFeatures: HeroFeature[] = [
        { icon: 'pi pi-heart', text: 'Naturalne składniki wspierające zdrowie zwierząt.' },
        { icon: 'pi pi-book', text: 'Opisy przypadków i sprawdzone rozwiązania.' },
        { icon: 'pi pi-verified', text: 'Wiedza oparta na wieloletnim doświadczeniu.' }
    ];
    heroButtons: HeroButton[] = [
        { text: 'Artykuły', link: '/artykuly' },
        { text: 'Produkty', link: '/produkty' }
    ];
}
