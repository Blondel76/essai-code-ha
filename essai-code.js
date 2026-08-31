/*
 * ==========================================================
 * MA PREMIÈRE CARTE — ÉTAPE 2 : LA CONFIGURATION
 * ==========================================================
 *
 * Nouveauté par rapport à l'étape 1 : le titre et le texte
 * ne sont plus écrits en dur dans le HTML. Ils viennent du
 * YAML que TU écris quand tu ajoutes la carte à un tableau
 * de bord, par exemple :
 *
 *   type: custom:essai-de-code-card
 *   title: Salon
 *   text: Tout va bien ici
 *
 * Pour ça, il faut comprendre UNE idée clé : la différence
 * entre "construire le HTML" (une fois) et "remplir le HTML
 * avec des valeurs" (à chaque changement). C'est LE pattern
 * que tu retrouveras dans 100% des cartes Home Assistant.
 */
class EssaiDeCodeCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    /*
     * Remarque : le HTML ci-dessous ne contient PLUS le texte
     * "Essai de code" ni "C'est ma première carte" en dur.
     * Les <div> sont vides — on les remplira juste après, à
     * chaque fois que setConfig() sera appelé.
     */
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }

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
        <div class="title"></div>
        <div class="text"></div>
      </div>
    `;

    /*
     * this.shadowRoot.querySelector(".title")
     * --------------------------------------------------------
     * Ceci va CHERCHER dans le HTML qu'on vient de créer
     * l'élément qui a la classe CSS "title", et le RANGE dans
     * une variable (this._title) pour pouvoir le réutiliser
     * plus tard, sans avoir à le rechercher à chaque fois.
     *
     * Pourquoi faire ça DANS le constructeur, qui ne s'exécute
     * qu'une seule fois ? Parce que chercher un élément dans
     * le HTML ("querySelector") coûte un (tout petit) peu de
     * temps. Autant le faire une seule fois et garder le
     * résultat sous la main, plutôt que de le refaire à
     * chaque mise à jour.
     */
    this._title = this.shadowRoot.querySelector(".title");
    this._text = this.shadowRoot.querySelector(".text");
  }

  /*
   * setConfig(config)
   * ----------------------------------------------------------
   * Rappel : Home Assistant appelle cette fonction une fois,
   * avec ton YAML transformé en objet JavaScript. Si tu as
   * écrit :
   *   title: Salon
   *   text: Tout va bien ici
   *
   * alors ici, config vaut : { title: "Salon", text: "Tout va bien ici" }
   */
  setConfig(config) {
    this.config = config;

    /*
     * On appelle notre propre fonction _render() (définie
     * juste en dessous) pour aller METTRE À JOUR le texte
     * affiché avec les nouvelles valeurs de config.
     *
     * Le nom "_render" n'a rien de magique — c'est juste une
     * convention très répandue (le "_" au début signifie
     * "fonction interne, pas censée être appelée depuis
     * l'extérieur de la classe").
     */
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // On pourrait aussi appeler this._render() ici si notre
    // carte affichait une valeur venant d'un capteur — pas le
    // cas pour l'instant, donc on se contente de stocker hass.
  }

  /*
   * _render()
   * ----------------------------------------------------------
   * Cette fonction est le CŒUR du pattern que tu retrouveras
   * partout : elle prend les valeurs actuelles de "config"
   * et les affiche dans les éléments HTML qu'on a gardés en
   * mémoire (this._title, this._text).
   *
   * "textContent" est la propriété qui contrôle le texte
   * affiché à l'intérieur d'un élément HTML.
   *
   * Le "||" (OU) fournit une valeur PAR DÉFAUT : si tu n'as
   * pas écrit "title:" dans ton YAML, config.title vaudra
   * "undefined", et donc on affichera "Essai de code" à la
   * place — la carte ne sera jamais vide par erreur.
   */
  _render() {
    this._title.textContent = this.config.title || "Essai de code";
    this._text.textContent = this.config.text || "C'est ma première carte";
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get("essai-de-code-card")) {
  customElements.define("essai-de-code-card", EssaiDeCodeCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "essai-de-code-card",
  name: "Essai de code",
  description: "Ma toute première carte, pour apprendre.",
  preview: true,
});
