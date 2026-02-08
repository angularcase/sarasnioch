import { Component, input, computed } from '@angular/core';

@Component({
    selector: 'app-atom-grey-box',
    standalone: true,
    imports: [],
    template: `
        <div [class]="containerClasses()">
            <ng-content select="[slot=top]" />
            <h5 class="text-surface-900 dark:text-surface-0 text-lg font-semibold leading-tight mb-3">{{ title() }}</h5>
            <ng-content select="[slot=subtitle]" />
            <ng-content select="[slot=body]" />
            <ng-content />
            <ng-content select="[slot=bottom]" />
            <ng-content select="[slot=buttons]" />
        </div>
    `
})
export class AtomGreyBoxComponent {
    title = input.required<string>();
    useBackground = input<boolean>(true);
    variant = input<'default' | 'green'>('default');

    containerClasses = computed(() => {
        let bg: string;
        if (this.variant() === 'green') {
            bg = 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40';
        } else if (this.useBackground()) {
            bg = 'bg-surface-50 dark:bg-surface-800 border-surface-100 dark:border-surface-700';
        } else {
            bg = 'border-surface-100 dark:border-surface-700';
        }
        return `relative p-6 rounded-xl border ${bg}`;
    });
}
