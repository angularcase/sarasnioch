import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-atom-grey-box',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div [class]="containerClasses()">
            <ng-content select="[slot=top]" />
            <h5 class="text-surface-900 dark:text-surface-0 text-lg font-semibold leading-tight mb-3">{{ title() }}</h5>
            <ng-content select="[slot=subtitle]" />
            <ng-content select="[slot=body]" />
            <ng-content />
            <ng-content select="[slot=bottom]" />
            @if (routerLink()) {
                <a [routerLink]="routerLink()!" class="absolute inset-0"></a>
            }
        </div>
    `
})
export class AtomGreyBoxComponent {
    title = input.required<string>();
    routerLink = input<string | null>(null);
    useBackground = input<boolean>(true);

    containerClasses = computed(() => {
        const bg = this.useBackground()
            ? 'bg-surface-50 dark:bg-surface-800 border-surface-100 dark:border-surface-700'
            : 'border-surface-100 dark:border-surface-700';
        const hover = this.routerLink()
            ? ' hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors cursor-pointer'
            : '';
        return `relative p-6 rounded-xl border ${bg}${hover}`;
    });
}
