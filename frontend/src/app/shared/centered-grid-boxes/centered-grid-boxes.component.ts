import { Component, input } from '@angular/core';
import { AtomGreyBoxComponent } from '../atom-grey-box/atom-grey-box.component';

export interface GreyBoxItem {
    title: string;
    body: string;
    routerLink?: string | null;
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
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (item of items(); track item.title) {
                    <app-atom-grey-box 
                        [title]="item.title" 
                        [body]="item.body" 
                        [routerLink]="item.routerLink ?? null" />
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
