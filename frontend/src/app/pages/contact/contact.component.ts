import { Component } from '@angular/core';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [PageContentComponent],
    templateUrl: './contact.component.html'
})
export class ContactComponent {
    breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Kontakt' }
    ];
}
