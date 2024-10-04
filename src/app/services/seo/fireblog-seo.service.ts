import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

  setTitle(title: string) {
    this.title.setTitle(title);
  }

  setMetaTags(tags: { name: string, content: string }[]) {
    tags.forEach(tag => {
      this.meta.updateTag({ name: tag.name, content: tag.content });
    });
  }

  setCanonicalLink(path: string = '') {
    const canURL = this.baseUrl + path;
    const linkElement = this.doc.getElementById('canonical') as HTMLLinkElement || this.doc.createElement('link');
    linkElement.setAttribute('rel', 'canonical');
    linkElement.setAttribute('href', canURL);
    if (!linkElement.id) {
      linkElement.setAttribute('id', 'canonical');
      this.doc.head.appendChild(linkElement);
    }
  }

  setStructuredData(data: any) {
    let script = this.doc.getElementById('structuredData') as HTMLScriptElement || this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    if (!script.id) {
      script.id = 'structuredData';
      this.doc.head.appendChild(script);
    }
  }
}
