import { Component } from '@angular/core';
import { PageContentComponent } from '../../shared/page-content/page-content.component';
import { BreadcrumbItem } from '../../shared/page-header/page-header.component';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import type { ContactFormData } from '../../shared/contact-form/contact-form.component';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [PageContentComponent, ContactFormComponent],
    templateUrl: './contact.component.html'
})
export class ContactComponent {
    breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Kontakt' }
    ];

    socialLinks = [
        { href: 'https://discord.com', label: 'Discord', icon: 'pi pi-discord' },
        { href: 'https://twitter.com', label: 'Twitter', icon: 'pi pi-twitter' },
        { href: 'https://youtube.com', label: 'YouTube', icon: 'pi pi-youtube' }
    ];

    onContactSubmit(data: ContactFormData): void {
        console.log('Contact form submitted:', data);
        // TODO: wysłać dane do API
    }
}
