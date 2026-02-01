import { Component, input } from '@angular/core';

@Component({
    selector: 'app-page-title',
    standalone: true,
    template: `<h1 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-4">{{ title() }}</h1>`
})
export class PageTitleComponent {
    title = input.required<string>();
}
