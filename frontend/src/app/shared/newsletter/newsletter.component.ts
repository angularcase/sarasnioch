import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-newsletter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="flex justify-start items-center">
            <div
                class="flex-1 p-8 md:p-12 rounded-2xl flex flex-col justify-start items-start gap-8 overflow-hidden"
                [ngClass]="
                    darkMode()
                        ? 'bg-surface-900'
                        : 'bg-surface-50 dark:bg-surface-800'
                "
            >
                <div class="flex flex-col justify-start items-start gap-4">
                    <div
                        class="text-3xl font-semibold leading-normal"
                        [ngClass]="darkMode() ? 'text-white' : 'text-surface-900 dark:text-surface-0'"
                    >
                        {{ title() }}
                    </div>
                    <div
                        class="text-xl font-normal leading-normal"
                        [ngClass]="darkMode() ? 'text-gray-400' : 'text-surface-600 dark:text-surface-300'"
                    >
                        {{ description() }}
                    </div>
                </div>
                <form
                    (ngSubmit)="onSubmit()"
                    class="h-14 pl-4 pr-2 py-4 rounded-[30px] border flex justify-start items-center gap-4 w-full max-w-lg"
                    [ngClass]="
                        darkMode()
                            ? 'bg-surface-800 border-surface-700'
                            : 'bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700'
                    "
                >
                    <div class="flex-1 flex justify-start items-start w-full">
                        <input
                            type="email"
                            [(ngModel)]="email"
                            [ngModelOptions]="{ standalone: true }"
                            [placeholder]="emailPlaceholder()"
                            class="w-full bg-transparent outline-0 text-base font-normal leading-normal"
                            [ngClass]="
                                darkMode()
                                    ? 'text-white placeholder:text-gray-400'
                                    : 'text-surface-900 dark:text-surface-0 placeholder:text-surface-500 dark:placeholder:text-surface-400'
                            "
                        />
                    </div>
                    <button
                        type="submit"
                        class="px-3 py-2 rounded-[28px] flex justify-start items-center gap-2 cursor-pointer font-medium text-base"
                        [ngClass]="
                            darkMode()
                                ? 'bg-primary border border-primary text-white'
                                : 'bg-surface-950 dark:bg-surface-50 border border-surface-950 dark:border-surface-50 text-surface-0 dark:text-surface-900'
                        "
                    >
                        <span>{{ buttonLabel() }}</span>
                    </button>
                </form>
            </div>
        </div>
    `
})
export class NewsletterComponent {
    darkMode = input<boolean>(false);
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
