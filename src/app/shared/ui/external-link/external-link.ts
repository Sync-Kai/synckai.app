import { Directive } from '@angular/core';

/**
 * Lien vers un autre site : ouvert dans un nouvel onglet, sans accès à cette page (noopener)
 * et sans lui transmettre l'adresse d'où vient le visiteur (noreferrer).
 */
@Directive({
  selector: 'a[skExternal]',
  host: { target: '_blank', rel: 'noopener noreferrer' },
})
export class ExternalLink {}
