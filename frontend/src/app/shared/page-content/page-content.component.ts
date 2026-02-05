import { Component, input } from '@angular/core';
import { BreadcrumbItem, PageHeaderComponent } from '../page-header/page-header.component';

@Component({
    selector: 'app-page-content',
    standalone: true,
    imports: [PageHeaderComponent],
    template: `
        @if (title()) {
            <app-page-header [title]="title()!" [breadcrumbs]="breadcrumbs()" />
        }
        <ng-content></ng-content>
    `
})
export class PageContentComponent {
    title = input<string>();
    breadcrumbs = input<BreadcrumbItem[]>([]);
}
