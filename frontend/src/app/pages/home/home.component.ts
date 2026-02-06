import { Component } from '@angular/core';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { HeroFeature, HeroMarineWithButtonComponent } from '../../shared/hero-marine-with-button/hero-marine-with-button.component';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [PageContentComponent, HeroMarineWithButtonComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    heroFeatures: HeroFeature[] = [
        { icon: 'pi pi-heart', text: 'Naturalne składniki wspierające zdrowie zwierząt.' },
        { icon: 'pi pi-book', text: 'Opisy przypadków i sprawdzone rozwiązania.' },
        { icon: 'pi pi-verified', text: 'Wiedza oparta na wieloletnim doświadczeniu.' }
    ];
}
