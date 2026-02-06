import { Component, input, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Product } from '../../core/services/product.service';

interface SelectOption {
    label: string;
    value: string | null;
}

@Component({
    selector: 'app-product-select',
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
                placeholder="Wybierz produkt"
                appendTo="body"
                class="w-full">
            </p-select>
        </div>
    `
})
export class ProductSelectComponent {
    options = input.required<Product[]>();
    selectedSlug = input<string | null>(null);
    selectedSlugChange = output<string | null>();

    selectedValue: string | null = null;

    selectOptions = computed<SelectOption[]>(() => {
        const allOption: SelectOption = { label: 'Wszystkie produkty', value: null };
        const productOptions: SelectOption[] = this.options().map(prod => ({
            label: prod.name,
            value: prod.slug
        }));
        return [allOption, ...productOptions];
    });

    constructor() {
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
