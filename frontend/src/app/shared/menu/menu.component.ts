import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { LogoComponent } from '../logo/logo.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AvatarModule, StyleClassModule, LogoComponent, RouterLink, RouterLinkActive],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})
export class MenuComponent {
    navs = signal([
        {
            label: 'Home',
            icon: 'pi-home',
            to: '/'
        },
        {
            label: 'Artykuły',
            icon: 'pi-book',
            to: '/artykuly'
        },
        {
            label: 'Produkty',
            icon: 'pi-briefcase',
            to: '/produkty'
        },
        {
            label: 'Kontakt',
            icon: 'pi-envelope',
            to: '/kontakt'
        }
    ]);
}
