import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (images().length > 0) {
            <div class="flex flex-col sm:flex-row gap-4 w-full">
                <div class="hidden sm:flex flex-col gap-4 lg:min-w-24">
                    @for (image of images(); track image; let i = $index) {
                        <img
                            [src]="image"
                            class="w-24 h-28 rounded-lg cursor-pointer transition-all duration-150 object-cover"
                            [class]="
                                selectedImageIndex() === i
                                    ? 'shadow-[0_0_0_2px] shadow-surface-900 dark:shadow-surface-0 ring-2 ring-surface-900 dark:ring-surface-0 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-950'
                                    : ''
                            "
                            (click)="selectedImageIndex.set(i)"
                            [alt]="'Gallery image ' + (i + 1)"
                        />
                    }
                </div>
                <div class="flex-1 min-w-0 max-w-full">
                    <img
                        [src]="images()[selectedImageIndex()]"
                        class="w-full h-auto max-h-[31.28rem] max-w-full object-contain rounded-lg"
                        [alt]="'Gallery image ' + (selectedImageIndex() + 1)"
                    />

                    <div class="flex gap-2 sm:hidden h-32 mt-4">
                        @for (image of images(); track image; let i = $index) {
                            <img
                                [src]="image"
                                class="flex-1 min-w-16 sm:min-w-20 md:min-w-24 h-auto max-h-28 object-cover rounded-md sm:rounded-lg cursor-pointer transition-all duration-150"
                                [class]="
                                    selectedImageIndex() === i
                                        ? 'shadow-[0_0_0_2px] shadow-surface-900 dark:shadow-surface-0 ring-2 ring-surface-900 dark:ring-surface-0 ring-offset-1 sm:ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-950'
                                        : ''
                                "
                                (click)="selectedImageIndex.set(i)"
                                [alt]="'Gallery image ' + (i + 1)"
                            />
                        }
                    </div>
                </div>
            </div>
        }
    `
})
export class GalleryComponent {
    images = input.required<string[]>();
    selectedImageIndex = signal(0);
}
