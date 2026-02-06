import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-atom-grey-box',
    standalone: true,
    imports: [RouterLink],
    template: `
        @if (routerLink()) {
            <a [routerLink]="routerLink()!" 
               class="block p-6 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-100 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                <h5 class="text-surface-900 dark:text-surface-0 text-lg font-semibold leading-tight mb-3">{{ title() }}</h5>
                <p class="text-surface-600 dark:text-surface-400 text-base leading-normal">{{ body() }}</p>
            </a>
        } @else {
            <div class="p-6 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-100 dark:border-surface-700">
                <h5 class="text-surface-900 dark:text-surface-0 text-lg font-semibold leading-tight mb-3">{{ title() }}</h5>
                <p class="text-surface-600 dark:text-surface-400 text-base leading-normal">{{ body() }}</p>
            </div>
        }
    `
})
export class AtomGreyBoxComponent {
    title = input.required<string>();
    body = input.required<string>();
    routerLink = input<string | null>(null);
}
