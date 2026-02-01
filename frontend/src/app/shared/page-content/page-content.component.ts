import { Component, input } from '@angular/core';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
    selector: 'app-page-content',
    standalone: true,
    imports: [PageTitleComponent],
    template: `
        <app-page-title [title]="title()" />
        <ng-content></ng-content>
    `
})
export class PageContentComponent {
    title = input.required<string>();
}
