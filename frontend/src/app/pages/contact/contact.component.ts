import { Component } from '@angular/core';
import { PageContentComponent } from '../../shared/page-content/page-content.component';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [PageContentComponent],
    templateUrl: './contact.component.html'
})
export class ContactComponent {
}
