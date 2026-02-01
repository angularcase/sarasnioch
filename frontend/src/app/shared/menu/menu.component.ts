import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { LogoComponent } from '../logo/logo.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AvatarModule, StyleClassModule, LogoComponent],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})
export class MenuComponent {
    navs = signal([
        {
            label: 'Home',
            icon: 'pi-home',
            to: ''
        },
        {
            label: 'Artykuly',
            icon: 'pi-book',
            to: ''
        },
        {
            label: 'Produkty',
            icon: 'pi-briefcase',
            to: ''
        },
        {
            label: 'Kontakt',
            icon: 'pi-envelope',
            to: ''
        }
    ]);

    selectedNav: string = 'Home';
}
