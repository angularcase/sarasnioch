import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

@Component({
    selector: 'app-contact-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule],
    template: `
        <div class="bg-surface-0 dark:bg-surface-950">
            <div class="p-14 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
                <div class="grid grid-cols-1 lg:grid-cols-2 items-start gap-20 h-full">
                    <div class="flex-1 flex flex-col h-full lg:max-w-lg gap-12">
                        <div class="flex-1 flex flex-col gap-6">
                            <h2 class="text-5xl leading-tight font-semibold text-surface-900 dark:text-surface-0">{{ title() }}</h2>
                            <p class="text-xl leading-normal text-surface-600 dark:text-surface-400">
                                {{ description() }}
                            </p>
                        </div>
                        <div class="mt-auto flex flex-col gap-4">
                            <div class="text-xl leading-normal text-surface-900 dark:text-surface-0">{{ email() }}</div>
                            <div class="flex items-center gap-4">
                                @for (link of socialLinks(); track link.href) {
                                    <a
                                        [href]="link.href"
                                        [attr.aria-label]="link.label"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="w-12 h-12 flex items-center justify-center bg-surface-0 dark:bg-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full border border-surface-200 dark:border-surface-700 cursor-pointer"
                                    >
                                        <i [class]="link.icon + ' text-xl! leading-none! text-surface-900 dark:text-surface-0'"></i>
                                    </a>
                                }
                            </div>
                        </div>
                    </div>
                    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex-1 flex flex-col gap-6 h-full">
                        <div class="flex flex-col gap-6">
                            <div class="flex flex-col gap-1">
                                <input
                                    pInputText
                                    type="text"
                                    formControlName="name"
                                    [placeholder]="namePlaceholder()"
                                    class="px-3 py-2 text-sm shadow-sm rounded-md w-full border"
                                    [class.border-red-500]="form.get('name')?.invalid && form.get('name')?.touched"
                                    [class.border-surface-200]="!(form.get('name')?.invalid && form.get('name')?.touched)"
                                    [class.dark:border-surface-700]="!(form.get('name')?.invalid && form.get('name')?.touched)"
                                />
                                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                                    <small class="text-red-500 text-sm">{{ nameRequiredError() }}</small>
                                }
                            </div>
                            <div class="flex flex-col gap-1">
                                <input
                                    pInputText
                                    type="email"
                                    formControlName="email"
                                    [placeholder]="emailPlaceholder()"
                                    class="px-3 py-2 text-sm shadow-sm rounded-md w-full border"
                                    [class.border-red-500]="form.get('email')?.invalid && form.get('email')?.touched"
                                    [class.border-surface-200]="!(form.get('email')?.invalid && form.get('email')?.touched)"
                                    [class.dark:border-surface-700]="!(form.get('email')?.invalid && form.get('email')?.touched)"
                                />
                                @if (form.get('email')?.invalid && form.get('email')?.touched) {
                                    <small class="text-red-500 text-sm">
                                        {{ form.get('email')?.errors?.['required'] ? emailRequiredError() : emailInvalidError() }}
                                    </small>
                                }
                            </div>
                            <div class="flex flex-col gap-1">
                                <textarea
                                    pInputTextarea
                                    formControlName="message"
                                    [placeholder]="messagePlaceholder()"
                                    rows="8"
                                    class="px-3 py-2 text-sm shadow-sm rounded-md w-full border"
                                    [class.border-red-500]="form.get('message')?.invalid && form.get('message')?.touched"
                                    [class.border-surface-200]="!(form.get('message')?.invalid && form.get('message')?.touched)"
                                    [class.dark:border-surface-700]="!(form.get('message')?.invalid && form.get('message')?.touched)"
                                ></textarea>
                                @if (form.get('message')?.invalid && form.get('message')?.touched) {
                                    <small class="text-red-500 text-sm">{{ messageRequiredError() }}</small>
                                }
                            </div>
                        </div>
                        <button
                            pButton
                            type="submit"
                            [disabled]="form.invalid"
                            class="px-3! py-2! text-sm! font-medium! bg-primary! border-primary! hover:bg-primary-600! hover:border-primary-600!"
                        >
                            <span pButtonLabel>{{ submitLabel() }}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `
})
export class ContactFormComponent {
    title = input<string>('Masz pytanie?');
    description = input<string>('Masz pytania? Wypełnij formularz poniżej, a skontaktujemy się z Tobą wkrótce.');
    email = input<string>('');
    socialLinks = input<Array<{ href: string; label: string; icon: string }>>([]);
    namePlaceholder = input<string>('Imię');
    emailPlaceholder = input<string>('Email');
    messagePlaceholder = input<string>('Wiadomość');
    submitLabel = input<string>('Wyślij');
    nameRequiredError = input<string>('Imię jest wymagane');
    emailRequiredError = input<string>('Email jest wymagany');
    emailInvalidError = input<string>('Podaj prawidłowy adres email');
    messageRequiredError = input<string>('Wiadomość jest wymagana');

    submit = output<ContactFormData>();

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required]
        });
    }

    onSubmit(): void {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.submit.emit(this.form.value);
        }
    }
}
