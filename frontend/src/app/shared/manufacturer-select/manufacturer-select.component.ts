import { Component, input, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Manufacturer } from '../../core/services/manufacturer.service';

interface SelectOption {
    label: string;
    value: string | null;
}

@Component({
    selector: 'app-manufacturer-select',
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
                placeholder="Wybierz producenta"
                appendTo="body"
                [filter]="true"
                filterPlaceholder="Szukaj producenta..."
                filterBy="label"
                filterMatchMode="contains"
                class="w-full">
            </p-select>
        </div>
    `
})
export class ManufacturerSelectComponent {
    options = input.required<Manufacturer[]>();
    selectedSlug = input<string | null>(null);
    selectedSlugChange = output<string | null>();

    selectedValue: string | null = null;

    selectOptions = computed<SelectOption[]>(() => {
        const allOption: SelectOption = { label: 'Wszyscy producenci', value: null };
        const manufacturerOptions: SelectOption[] = this.options().map(man => ({
            label: man.name,
            value: man.slug
        }));
        return [allOption, ...manufacturerOptions];
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
