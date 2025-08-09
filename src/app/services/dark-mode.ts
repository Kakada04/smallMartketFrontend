import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkMode {
  // Signal to track dark mode state
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Initialize theme from localStorage or system preference
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode.set(true);
      } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.isDarkMode.set(true);
      }
    }

    // Effect to sync dark mode state with DOM and localStorage
    effect(() => {
      const isDark = this.isDarkMode();
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Method to toggle dark mode
  toggleDarkMode(): void {
    this.isDarkMode.set(!this.isDarkMode());
  }

  // Method to check current dark mode state
  getDarkModeStatus(): boolean {
    return this.isDarkMode();
  }
}