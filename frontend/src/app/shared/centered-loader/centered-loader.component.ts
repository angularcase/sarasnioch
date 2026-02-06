import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-centered-loader',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule],
    template: `
        <div class="flex flex-col items-center justify-center gap-4 min-h-[12rem] py-12">
            <p-progressSpinner
                styleClass="w-16 h-16"
                strokeWidth="3"
                ariaLabel="Ładowanie"
            />
            @if (label()) {
                <p class="text-surface-600 dark:text-surface-400 text-sm">{{ label() }}</p>
            }
        </div>
    `
})
export class CenteredLoaderComponent {
    /** Opcjonalny tekst pod spinnerem (np. "Ładowanie artykułów...") */
    label = input<string>();
}
