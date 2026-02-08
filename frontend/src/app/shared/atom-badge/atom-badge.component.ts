import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-atom-badge',
    standalone: true,
    imports: [RouterLink],
    template: `
        <a 
            [routerLink]="routerLink()" 
            [class]="badgeClasses()"
            class="relative z-10 px-2 py-1 text-xs font-medium rounded-md inline-block">
            {{ label() }}
        </a>
    `
})
export class AtomBadgeComponent {
    label = input.required<string>();
    routerLink = input.required<string>();
    variant = input.required<'category' | 'product'>();

    badgeClasses = computed(() => {
        if (this.variant() === 'category') {
            return 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200';
        } else {
            return 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300';
        }
    });
}
