import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

export interface HeroFeature {
    icon: string;
    text: string;
}

@Component({
    selector: 'app-hero-marine-with-button',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
        <div class="relative overflow-hidden bg-surface-900 p-8 lg:p-20 rounded-3xl">
            <!-- Mobile background image -->
            <img [src]="imageSrc()" [alt]="imageAlt()" 
                class="absolute top-8 left-1/2 -translate-x-1/2 w-4/5 max-w-sm opacity-30 pointer-events-none z-0 lg:hidden" />
            
            <div class="relative z-10 flex flex-wrap lg:flex-row flex-col gap-12 items-center">
                <div class="flex-1 p-4">
                    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        @if (highlightedPrefix()) {
                            <span class="text-green-500">{{ highlightedPrefix() }}</span>
                        }
                        {{ title() }}
                    </h1>
                    <p class="text-xl lg:text-2xl text-gray-400 mb-8 leading-normal">{{ subtitle() }}</p>
                    @if (features().length > 0) {
                        <ul class="list-none flex flex-col gap-4">
                            @for (feature of features(); track feature.text) {
                                <li class="flex items-center gap-2">
                                    <i [class]="feature.icon + ' text-primary text-xl!'"></i>
                                    <span class="text-gray-400 leading-normal">{{ feature.text }}</span>
                                </li>
                            }
                        </ul>
                    }
                    @if (buttonText()) {
                        <button pButton rounded size="large" class="mt-12">
                            <span pButtonLabel>{{ buttonText() }}</span>
                        </button>
                    }
                </div>
                <!-- Desktop image -->
                <div class="hidden lg:block flex-1 text-center lg:text-right overflow-hidden">
                    <img [src]="imageSrc()" [alt]="imageAlt()" class="w-full max-w-md lg:w-auto lg:max-w-xl mx-auto" />
                </div>
            </div>
        </div>
    `
})
export class HeroMarineWithButtonComponent {
    highlightedPrefix = input<string>();
    title = input.required<string>();
    subtitle = input.required<string>();
    features = input<HeroFeature[]>([]);
    buttonText = input<string>();
    imageSrc = input.required<string>();
    imageAlt = input<string>('Hero image');
}
