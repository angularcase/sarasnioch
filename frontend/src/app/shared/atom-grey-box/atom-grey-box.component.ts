import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-atom-grey-box',
    standalone: true,
    imports: [RouterLink],
    template: `
        @if (routerLink()) {
            <a [routerLink]="routerLink()!" 
               [class]="'block p-6 rounded-xl border transition-colors ' + (useBackground() ? 'bg-surface-50 dark:bg-surface-800 border-surface-100 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700' : 'border-surface-100 dark:border-surface-700')">
                <h5 class="text-surface-900 dark:text-surface-0 text-lg font-semibold leading-tight mb-3">{{ title() }}</h5>
                <p class="text-surface-600 dark:text-surface-400 text-base leading-normal">{{ body() }}</p>
            </a>
        } @else {
            <div [class]="'p-6 rounded-xl border ' + (useBackground() ? 'bg-surface-50 dark:bg-surface-800 border-surface-100 dark:border-surface-700' : 'border-surface-100 dark:border-surface-700')">
                <h5 class="text-surface-900 dark:text-surface-0 text-lg font-semibold leading-tight mb-3">{{ title() }}</h5>
                @if (body()) {
                    <p class="text-surface-600 dark:text-surface-400 text-base leading-normal">{{ body() }}</p>
                }
                <ng-content />
            </div>
        }
    `
})
export class AtomGreyBoxComponent {
    title = input.required<string>();
    body = input<string>('');
    routerLink = input<string | null>(null);
    useBackground = input<boolean>(true);
}
