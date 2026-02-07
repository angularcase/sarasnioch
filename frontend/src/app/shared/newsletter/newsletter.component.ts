import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-newsletter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="flex justify-start items-center">
            <div class="flex-1 p-8 md:p-12 bg-surface-50 dark:bg-surface-800 rounded-2xl flex flex-col justify-start items-start gap-8 overflow-hidden">
                <div class="flex flex-col justify-start items-start gap-4">
                    <div class="text-surface-900 dark:text-surface-0 text-3xl font-semibold leading-normal">
                        {{ title() }}
                    </div>
                    <div class="text-surface-600 dark:text-surface-300 text-xl font-normal leading-normal">
                        {{ description() }}
                    </div>
                </div>
                <form
                    (ngSubmit)="onSubmit()"
                    class="h-14 pl-4 pr-2 py-4 bg-surface-0 dark:bg-surface-900 rounded-[30px] border border-surface-200 dark:border-surface-700 flex justify-start items-center gap-4 w-full max-w-lg"
                >
                    <div class="flex-1 flex justify-start items-start w-full">
                        <input
                            type="email"
                            [(ngModel)]="email"
                            [ngModelOptions]="{ standalone: true }"
                            [placeholder]="emailPlaceholder()"
                            class="w-full bg-transparent outline-0 text-surface-900 dark:text-surface-0 placeholder:text-surface-500 dark:placeholder:text-surface-400 text-base font-normal leading-normal"
                        />
                    </div>
                    <button
                        type="submit"
                        class="px-3 py-2 bg-surface-950 dark:bg-surface-50 rounded-[28px] border border-surface-950 dark:border-surface-50 flex justify-start items-center gap-2 cursor-pointer"
                    >
                        <span class="text-surface-0 dark:text-surface-900 text-base font-medium">{{ buttonLabel() }}</span>
                    </button>
                </form>
            </div>
        </div>
    `
})
export class NewsletterComponent {
    title = input<string>('Bądź na bieżąco');
    description = input<string>(
        'Otrzymuj nowe artykuły, opisy przypadków klinicznych i praktyczne wskazówki dotyczące naturalnych produktów weterynaryjnych.'
    );
    emailPlaceholder = input<string>('Adres e-mail');
    buttonLabel = input<string>('Zapisz się');

    subscribe = output<string>();

    email = '';

    onSubmit(): void {
        const value = this.email.trim();
        if (value) {
            this.subscribe.emit(value);
            this.email = '';
        }
    }
}
