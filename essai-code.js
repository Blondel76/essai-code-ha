/*
 * ==========================================================
 * MA PREMIÈRE CARTE — ÉTAPE 4 : AJOUTER UNE ICÔNE
 * ==========================================================
 *
 * Nouveauté : une icône à droite du titre, comme dans tes
 * "vraies" cartes. Configurable en YAML :
 *
 *   type: custom:essai-de-code-card
 *   title: Salon
 *   entity: sensor.temperature_salon
 *   icon: mdi:thermometer
 *
 * <ha-icon> est un élément HTML FOURNI PAR Home Assistant.
 * Contrairement à <div> ou <span> qui existent dans tous les
 * navigateurs, <ha-icon> n'existe QUE parce que tu es dans
 * l'interface de Home Assistant, qui l'a déjà enregistré pour
 * toi (un peu comme on l'a fait nous-mêmes avec
 * customElements.define pour NOTRE carte).
 *
 * Il suffit de lui donner un nom d'icône Material Design
 * Icons (format "mdi:nom-icone") pour qu'il l'affiche.
 */
class EssaiDeCodeCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

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

        /*
         * NOUVEAU : .header met le titre et l'icône côte à
         * côte, avec l'icône poussée tout à droite.
         *
         * display: flex transforme cette div en "conteneur
         * flexible" : ses enfants directs (.title et .icon)
         * se placent automatiquement en ligne, l'un à côté de
         * l'autre, au lieu de l'un en dessous de l'autre.
         *
         * justify-content: space-between écarte le premier
         * enfant tout à gauche et le dernier tout à droite.
         */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .title {
          font-size: 16px;
          font-weight: 600;
        }

        .text {
          font-size: 14px;
          color: var(--secondary-text-color, #aaaaaa);
          margin-top: 8px;
        }

        /*
         * NOUVEAU : on cible directement la balise ha-icon
         * (pas une classe .icon, la balise elle-même), pour
         * lui donner une taille et une couleur.
         *
         * --mdc-icon-size est une "variable CSS" propre à
         * ha-icon : c'est SA façon à elle de se laisser
         * redimensionner (elle ne comprendrait pas un simple
         * width/height classique).
         */
        ha-icon {
          --mdc-icon-size: 24px;
          color: #5dade2;
        }
      </style>

      <div class="card">
        <div class="header">
          <div class="title"></div>
          <ha-icon></ha-icon>
        </div>
        <div class="text"></div>
      </div>
    `;

    this._title = this.shadowRoot.querySelector(".title");
    this._text = this.shadowRoot.querySelector(".text");

    /*
     * NOUVEAU : on garde aussi une poignée vers l'icône, pour
     * pouvoir lui dire plus tard (dans _render) QUELLE icône
     * afficher.
     */
    this._icon.setAttribute("icon", this.config.icon || "mdi:eye");
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Il faut préciser une entité (entity: sensor.xxx)");
    }

    this.config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this.config || !this._hass) {
      return;
    }

    this._title.textContent = this.config.title || "Essai de code";

    /*
     * NOUVEAU : choix de l'icône, AVEC valeur par défaut.
     * ----------------------------------------------------------
     * Exactement le même principe que "this.config.title ||
     * 'Essai de code'" vu à l'étape 2 : si tu n'as pas écrit
     * "icon:" dans ton YAML, on utilise une icône par défaut
     * plutôt que de laisser un vide bizarre.
     *
     * this._icon.icon = "mdi:xxx" (et non setAttribute) est
     * une autre façon d'écrire la même chose — <ha-icon>
     * accepte les deux, ce sont juste deux syntaxes possibles
     * pour lui donner sa valeur.
     */
    this._icon.icon = this.config.icon || "mdi:eye";

    const entity = this._hass.states[this.config.entity];

    if (!entity) {
      this._text.textContent = "Capteur introuvable";
      return;
    }

    this._text.textContent = entity.state;
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
