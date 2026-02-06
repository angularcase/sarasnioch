import { Component, input, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { AnimalCategory } from '../../core/services/animal-category.service';

interface SelectOption {
    label: string;
    value: string | null;
}

@Component({
    selector: 'app-animal-category-select',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectModule],
    template: `
        <div class="flex justify-start w-full">
            <p-select
                [options]="selectOptions()"
                [(ngModel)]="selectedValue"
                (ngModelChange)="onChange($event)"
                optionLabel="label"
                optionValue="value"
                placeholder="Wybierz kategorię"
                appendTo="body"
                class="w-full md:max-w-md">
            </p-select>
        </div>
    `
})
export class AnimalCategorySelectComponent {
    options = input.required<AnimalCategory[]>();
    selectedSlug = input<string | null>(null);
    selectedSlugChange = output<string | null>();

    selectedValue: string | null = null;

    selectOptions = computed<SelectOption[]>(() => {
        const allOption: SelectOption = { label: 'Wszystkie kategorie', value: null };
        const categoryOptions: SelectOption[] = this.options().map(cat => ({
            label: cat.name,
            value: cat.slug
        }));
        return [allOption, ...categoryOptions];
    });

    constructor() {
        // Sync input changes to selectedValue using effect
        effect(() => {
            const slug = this.selectedSlug();
            if (this.selectedValue !== slug) {
                this.selectedValue = slug;
            }
        });
    }

    onChange(value: string | null): void {
        this.selectedValue = value;
        this.selectedSlugChange.emit(value);
    }
}
