import { Component, input } from '@angular/core';
import { BreadcrumbItem, PageHeaderComponent } from '../page-header/page-header.component';
import { NewsletterComponent } from '../newsletter/newsletter.component';

@Component({
    selector: 'app-page-content',
    standalone: true,
    imports: [PageHeaderComponent, NewsletterComponent],
    template: `
        @if (title()) {
            <app-page-header [title]="title()!" [breadcrumbs]="breadcrumbs()" />
        }
        <div class="pt-8 flex flex-col gap-16">
            <ng-content></ng-content>
            <app-newsletter [darkMode]="true" />
        </div>
    `
})
export class PageContentComponent {
    title = input<string>();
    breadcrumbs = input<BreadcrumbItem[]>([]);
}
