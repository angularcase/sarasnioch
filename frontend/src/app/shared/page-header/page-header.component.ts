import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
    label: string;
    route?: string;
}

@Component({
    selector: 'app-page-header',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <div class="bg-surface-0 dark:bg-surface-950 py-8">
            <div class="flex flex-col gap-4">
                @if (breadcrumbs().length > 0) {
                    <ul class="list-none p-0 m-0 flex flex-wrap items-center font-medium">
                        @for (item of breadcrumbs(); track item.label; let last = $last) {
                            <li class="flex items-center">
                                @if (!last && item.route) {
                                    <a [routerLink]="item.route" class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer truncate sm:max-w-none max-w-[120px]">
                                        {{ item.label }}
                                    </a>
                                } @else if (!last) {
                                    <span class="text-surface-500 dark:text-surface-300 leading-normal truncate sm:max-w-none max-w-[120px]">
                                        {{ item.label }}
                                    </span>
                                } @else {
                                    <span class="text-surface-900 dark:text-surface-0 leading-normal">
                                        {{ item.label }}
                                    </span>
                                }
                            </li>
                            @if (!last) {
                                <li class="px-2">
                                    <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal!"></i>
                                </li>
                            }
                        }
                    </ul>
                }
                <span class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ title() }}</span>
            </div>
        </div>
    `
})
export class PageHeaderComponent {
    breadcrumbs = input<BreadcrumbItem[]>([]);
    title = input.required<string>();
}
