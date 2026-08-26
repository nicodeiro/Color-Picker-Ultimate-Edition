# Nouvelle couleur — cible approuvée

## Source visuelle

- Référence approuvée : `target-imagen.png`
- Dimensions de la référence : `1066 × 1476 px`
- SHA-256 : `921b066992558d2e4b84d6d59ddb9d8e148e7bbaa55eb8244f417d8b77c1e4bd`
- État produit : éditeur de création manuelle ouvert depuis **Nouvelle couleur**.

La référence est adaptée au popup natif de `340 × 470 px`. L’instruction
explicite du produit prime sur la composition complète de l’image : le header et
le grand cercle existants ne sont pas redessinés. La cible d’implémentation
commence immédiatement sous le cercle.

## Invariant verrouillé

Le sous-arbre existant reste strictement inchangé :

```html
<button id="hero-swatch" class="hero-swatch" ...>
    <span class="hero-ring intelligence-ring" aria-hidden="true"></span>
    <span class="hero-swatch-fill" aria-hidden="true"></span>
</button>
```

À `340 × 470 px`, son rectangle natif de référence est :

- x : `111 px` ;
- y : `74 px` ;
- largeur : `118 px` ;
- hauteur : `118 px`.

La tolérance de QA est de `0,5 px`. L’asset, les pseudo-éléments, l’ombre,
l’animation et le comportement du cercle doivent aussi rester identiques.

## Géométrie adaptée au popup

L’éditeur inférieur est centré sur une colonne de `216 px` :

| Élément | x | y | Largeur | Hauteur |
|---|---:|---:|---:|---:|
| Plan saturation / valeur | 62 | 205 | 216 | 86 |
| Zone interactive de teinte | 62 | 299 | 216 | 24 |
| Piste de teinte visible | 62 | 307 | 216 | 8 |
| Onglets HEX / RGB / HSL | 62 | 331 | 216 | 36 |
| Valeur éditable | 62 | 375 | 216 | 40 |
| Bouton Enregistrer | 62 | 423 | 216 | 40 |

Le popup ne doit présenter aucun débordement horizontal. Le CTA reste
atteignable au clavier à la taille native et au zoom/reflow borné.

## Style

- Même fond que l’Inspecteur couleur, sans carte englobante.
- Rayon de `7 px` pour le plan, les onglets, les champs et le CTA.
- Plan : bordure `1 px var(--ui-separator-strong)`.
- Repère SV : `18 × 18 px`, anneau blanc `2 px`, toujours entièrement visible.
- Teinte : piste arc-en-ciel locale et poignée `20 × 20 px`, anneau blanc `2 px`.
- Onglets : surface atténuée et onglet actif sur la surface principale.
- Valeurs : Roboto Mono ; interface et CTA : Roboto Flex.
- CTA clair : fond `#07132D`, texte blanc.
- CTA sombre : fond `#F5F5F7`, texte `#101012`.
- Focus : `2 px var(--ui-focus)`, offset `2 px`.
- Aucun halo ni flou supplémentaire autour du grand cercle.

## Comportement attendu

1. Les deux entrées (**Nouvelle couleur** et le `+` de **Tout voir**) ouvrent
   l’éditeur intégré, sans `input[type=color]` natif.
2. Le brouillon démarre sur la couleur actuellement sélectionnée.
3. Plan SV, teinte et champs HEX/RGB/HSL restent synchronisés.
4. Le cercle existant reflète le brouillon sans mutation de son DOM ou de son
   style propre.
5. Aucune valeur n’est écrite dans `chrome.storage.local` avant Enregistrer.
6. Enregistrer ajoute une valeur valide une seule fois, déduplique l’historique
   et revient à la vue d’origine avec la nouvelle couleur sélectionnée.
7. Retour et Échap annulent, restaurent la couleur précédente et restituent le
   focus au déclencheur d’origine.
8. Les onglets ont un tabindex mobile ; le plan accepte pointeur et clavier ; la
   teinte utilise un contrôle range sémantique.
9. Une saisie invalide produit `aria-invalid="true"`, une annonce locale et un
   CTA désactivé, sans déplacement de mise en page.

## États à vérifier

- clair et sombre ;
- ouverture depuis l’Inspecteur et depuis Tout voir ;
- HEX valide et invalide ;
- édition RGB et HSL ;
- limites noir, blanc, rouge, vert et bleu ;
- annulation par Retour et Échap ;
- sauvegarde et déduplication ;
- focus visible, ordre clavier et 200 % de reflow ;
- vraie action Brave à `340 × 470 px`, sans erreur console ni requête distante ;
- stress synthétique aux formats iPhone 12 mini, iPhone 14 Pro, iPhone 17 Pro
  Max et iPhone SE (3e génération), sans les présenter comme cibles Chrome.
