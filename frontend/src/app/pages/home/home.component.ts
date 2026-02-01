import { Component } from '@angular/core';
import { PageContentComponent } from '../../shared/page-content/page-content.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [PageContentComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent {
}
