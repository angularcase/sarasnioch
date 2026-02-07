import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

export interface HeroFeature {
    icon: string;
    text: string;
}

export interface HeroButton {
    text: string;
    link: string;
}

@Component({
    selector: 'app-hero-marine-with-button',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterLink],
    template: `
        <div class="relative overflow-hidden bg-surface-900 p-8 lg:p-20 rounded-3xl">
            <!-- Mobile background image -->
            <img [src]="imageSrc()" [alt]="imageAlt()" 
                class="absolute top-8 left-1/2 -translate-x-1/2 w-4/5 max-w-sm opacity-30 pointer-events-none z-0 lg:hidden" />
            
            <div class="relative z-10 flex flex-wrap lg:flex-row flex-col gap-12 items-start">
                <div class="flex-1 p-4">
                    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        @if (highlightedPrefix()) {
                            <span class="text-primary">{{ highlightedPrefix() }}</span>
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
                    @if (buttons().length > 0) {
                        <div class="flex flex-wrap gap-4 mt-12">
                            @for (btn of buttons(); track btn.link) {
                                <a pButton size="large" [routerLink]="btn.link" class="!rounded-md">
                                    <span pButtonLabel>{{ btn.text }}</span>
                                </a>
                            }
                        </div>
                    } @else if (buttonText()) {
                        <button pButton size="large" class="mt-12 !rounded-md">
                            <span pButtonLabel>{{ buttonText() }}</span>
                        </button>
                    }
                </div>
                <!-- Right column: projected content (e.g. newsletter) or desktop image -->
                <div class="flex flex-1 flex-col justify-start text-left overflow-hidden min-w-0">
                    <ng-content select="[heroRightColumn]" />
                    @if (showImage()) {
                        <img [src]="imageSrc()" [alt]="imageAlt()" class="hidden lg:block w-full max-w-md lg:w-auto lg:max-w-xl mx-auto" />
                    }
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
    /** Dwa lub więcej przycisków (text + link). Gdy ustawione, ignorowane jest buttonText. */
    buttons = input<HeroButton[]>([]);
    buttonText = input<string>();
    imageSrc = input.required<string>();
    imageAlt = input<string>('Hero image');
    /** Gdy false, w prawej kolumnie nie pokazujemy obrazka (np. gdy jest ng-content). */
    showImage = input<boolean>(true);
}
