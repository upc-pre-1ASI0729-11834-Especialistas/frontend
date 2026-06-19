import { Component, OnInit } from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher implements OnInit {
  currentLanguage = 'en';
  languages= ['en', 'es'];

  constructor(private translate : TranslateService) {
    this.currentLanguage = translate.getCurrentLang() || 'en';
  }

  ngOnInit() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && this.languages.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
      this.translate.use(savedLanguage);
    } else {
      const browserLanguage = this.translate.getBrowserLang();
      if (browserLanguage && this.languages.includes(browserLanguage)) {
        this.currentLanguage = browserLanguage;
        this.translate.use(browserLanguage);
      }
    }
  }

  useLanguage(language: string) {
    console.log('LanguageSwitcher: switching to', language);
    this.currentLanguage = language;
    this.translate.use(language);
    localStorage.setItem('selectedLanguage', language);
  }
}
