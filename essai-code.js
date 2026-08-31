/*
 * ==========================================================
 * MA PREMIÈRE CARTE HOME ASSISTANT
 * ==========================================================
 *
 * Une "carte personnalisée" dans Home Assistant, c'est en
 * réalité un "Web Component" : un nouvel élément HTML que TU
 * inventes (comme <div> ou <button>, mais avec ton propre nom
 * et ton propre comportement).
 *
 * Un fichier de carte contient toujours les mêmes 4 briques :
 *   1. Une classe qui décrit comment la carte fonctionne
 *   2. Du HTML + CSS pour l'apparence
 *   3. L'enregistrement du composant auprès du navigateur
 *   4. L'enregistrement auprès de Home Assistant (pour le
 *      retrouver dans l'éditeur de tableau de bord)
 */


/*
 * 1. LA CLASSE
 * ----------------------------------------------------------
 * "class EssaiDeCodeCard extends HTMLElement" veut dire :
 * "je crée un nouveau type d'élément HTML, qui hérite de
 * tout ce que sait déjà faire un élément HTML normal."
 *
 * Le nom de la classe (EssaiDeCodeCard) est libre, mais par
 * convention on le met en PascalCase (chaque mot avec une
 * majuscule, sans espace).
 */
class EssaiDeCodeCard extends HTMLElement {

  /*
   * LE CONSTRUCTEUR
   * --------------------------------------------------------
   * Cette fonction s'exécute automatiquement UNE SEULE FOIS,
   * au moment où le navigateur crée ta carte pour l'afficher
   * à l'écran. C'est ici qu'on prépare le HTML et le CSS.
   */
  constructor() {

    // Obligatoire : on prévient la classe parente (HTMLElement)
    // qu'on l'utilise. Toujours la première ligne du constructeur.
    super();

    /*
     * LE SHADOW DOM
     * ------------------------------------------------------
     * this.attachShadow({ mode: "open" }) crée une "bulle"
     * HTML isolée à l'intérieur de ta carte. Le CSS que tu
     * écris dedans ne peut pas s'échapper vers le reste du
     * tableau de bord, et le CSS du reste du tableau de bord
     * ne peut pas venir perturber ta carte.
     *
     * C'est comme une pièce fermée : ce qui se passe dedans
     * reste dedans.
     */
    this.attachShadow({ mode: "open" });

    /*
     * LE HTML + CSS
     * ------------------------------------------------------
     * this.shadowRoot.innerHTML = `...` insère du HTML et du
     * CSS à l'intérieur de cette "bulle". Les backticks ` `
     * (et non des guillemets normaux) permettent d'écrire du
     * texte sur plusieurs lignes en JavaScript.
     */
    this.shadowRoot.innerHTML = `
      <style>
        /*
         * :host désigne la carte elle-même (l'élément
         * <essai-de-code-card> vu de l'extérieur).
         */
        :host {
          display: block;
        }

        .card {
          background: #1c1c1c;
          border: 1px solid #333333;
          border-radius: 12px;
          padding: 16px;
          box-sizing: border-box;
          color: var(--primary-text-color, #ffffff);
        }

        .title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .text {
          font-size: 14px;
          color: var(--secondary-text-color, #aaaaaa);
        }
      </style>

      <div class="card">
        <div class="title">Essai de code</div>
        <div class="text">C'est ma première carte</div>
      </div>
    `;
  }

  /*
   * setConfig(config)
   * ----------------------------------------------------------
   * Home Assistant APPELLE TOUJOURS cette fonction automati-
   * quement, une fois, juste après avoir créé ta carte. Il te
   * donne en paramètre "config" : un objet JavaScript qui
   * contient tout ce que tu as écrit dans le YAML de la carte
   * (type, title, entity, etc.).
   *
   * Cette fonction est OBLIGATOIRE, même si (comme ici) elle
   * ne fait presque rien : Home Assistant plante si elle
   * n'existe pas.
   */
  setConfig(config) {
    // On garde une copie de la config, au cas où on en aurait
    // besoin plus tard (pas utilisé dans cette carte simple).
    this.config = config;
  }

  /*
   * set hass(hass)
   * ----------------------------------------------------------
   * Ceci n'est pas une fonction normale, c'est un "setter" :
   * une propriété spéciale qui s'exécute automatiquement
   * chaque fois que Home Assistant met à jour ses données
   * (donc très souvent — plusieurs fois par seconde parfois).
   *
   * "hass" contient TOUT l'état de ta maison : la température
   * de chaque capteur, l'état de chaque lumière, etc. Une
   * carte "vivante" lirait des valeurs ici pour les afficher.
   *
   * Notre carte est 100% statique (texte fixe), donc on n'a
   * rien à faire ici — mais Home Assistant s'attend à ce que
   * cette propriété existe, donc on la déclare quand même.
   */
  set hass(hass) {
    this._hass = hass;
  }

  /*
   * getCardSize()
   * ----------------------------------------------------------
   * Indique à Home Assistant la hauteur approximative de ta
   * carte, en unités de grille (1 unité ≈ 50px). Aide surtout
   * à l'agencement automatique des cartes empilées.
   */
  getCardSize() {
    return 1;
  }
}


/*
 * 2. ENREGISTREMENT DU COMPOSANT AUPRÈS DU NAVIGATEUR
 * ----------------------------------------------------------
 * Jusqu'ici, "EssaiDeCodeCard" n'est qu'une classe JavaScript
 * comme une autre. Cette ligne dit au NAVIGATEUR : "quand tu
 * vois une balise <essai-de-code-card> dans le HTML, utilise
 * cette classe pour savoir comment elle doit se comporter."
 *
 * Règle du navigateur : le nom de balise DOIT contenir un
 * tiret (essai-de-code-card, pas essaidecodecard).
 *
 * Le "if" évite une erreur si jamais le fichier est chargé
 * deux fois par erreur (le navigateur refuse de redéfinir un
 * même nom de balise deux fois).
 */
if (!customElements.get("essai-de-code-card")) {
  customElements.define("essai-de-code-card", EssaiDeCodeCard);
}


/*
 * 3. ENREGISTREMENT AUPRÈS DE HOME ASSISTANT
 * ----------------------------------------------------------
 * Cette dernière partie n'a rien à voir avec le navigateur :
 * c'est Home Assistant qui lit "window.customCards" pour
 * savoir quelles cartes proposer dans son éditeur visuel
 * (bouton "+ Ajouter une carte" d'un tableau de bord).
 *
 * Sans ce bloc, ta carte fonctionnerait quand même si tu
 * l'ajoutais "à la main" en YAML — mais elle n'apparaîtrait
 * jamais dans la liste visuelle des cartes disponibles.
 */
window.customCards = window.customCards || [];

window.customCards.push({
  type: "essai-de-code-card",   // doit correspondre au nom défini plus haut
  name: "Essai de code",         // nom affiché dans le catalogue de cartes
  description: "Ma toute première carte, pour apprendre.",
  preview: true,
});
