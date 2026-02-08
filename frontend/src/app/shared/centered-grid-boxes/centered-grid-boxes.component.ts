import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-centered-grid-boxes',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="bg-surface-0 dark:bg-surface-950 overflow-hidden">
            <h2 class="text-surface-900 font-semibold text-center text-4xl lg:text-5xl leading-tight mb-4 dark:text-surface-0">{{ title() }}</h2>
            <p class="text-xl leading-normal text-surface-600 dark:text-surface-400 text-center max-w-[96%] lg:max-w-240 mx-auto mb-14">
                {{ subtitle() }}
            </p>
            <ng-content select="[slot=above]" />
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <ng-content />
            </div>
        </div>
    `
})
export class CenteredGridBoxesComponent {
    title = input.required<string>();
    subtitle = input.required<string>();
}
