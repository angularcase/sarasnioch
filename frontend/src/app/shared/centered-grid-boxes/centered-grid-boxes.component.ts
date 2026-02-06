import { Component, input } from '@angular/core';
import { AtomGreyBoxComponent } from '../atom-grey-box/atom-grey-box.component';

export interface GreyBoxItem {
    title: string;
    body: string;
    routerLink?: string | null;
    animalCategories?: Array<{ name: string; slug: string }>;
    manufacturers?: Array<{ name: string; slug: string }>;
}

@Component({
    selector: 'app-centered-grid-boxes',
    standalone: true,
    imports: [AtomGreyBoxComponent],
    template: `
        <div class="bg-surface-0 dark:bg-surface-950 overflow-hidden">
            <h2 class="text-surface-900 font-semibold text-center text-5xl leading-tight mb-4 dark:text-surface-0">{{ title() }}</h2>
            <p class="text-xl leading-normal text-surface-600 dark:text-surface-400 text-center max-w-[96%] lg:max-w-240 mx-auto mb-14">
                {{ subtitle() }}
            </p>
            <div class="mb-6">
                <ng-content />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (item of items(); track item.title) {
                    <app-atom-grey-box 
                        [title]="item.title" 
                        [body]="item.body" 
                        [routerLink]="item.routerLink ?? null">
                        @if (item.animalCategories && item.animalCategories.length > 0) {
                            <div slot="top" class="flex flex-wrap gap-2 mb-3">
                                @for (cat of item.animalCategories; track cat.slug) {
                                    <span class="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-md">
                                        {{ cat.name }}
                                    </span>
                                }
                            </div>
                        }
                        @if (item.manufacturers && item.manufacturers.length > 0) {
                            <div slot="bottom" class="flex flex-wrap gap-2 mt-3">
                                @for (man of item.manufacturers; track man.slug) {
                                    <span class="px-2 py-1 text-xs font-medium bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-md">
                                        {{ man.name }}
                                    </span>
                                }
                            </div>
                        }
                    </app-atom-grey-box>
                }
            </div>
        </div>
    `
})
export class CenteredGridBoxesComponent {
    title = input.required<string>();
    subtitle = input.required<string>();
    items = input.required<GreyBoxItem[]>();
}
