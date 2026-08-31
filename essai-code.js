 /*
 * ==========================================================
 * MA PREMIÈRE CARTE — ÉTAPE 7 : FAIRE UNE COMPARAISON
 * ==========================================================
 *
 * Configuration YAML :
 *
 *   type: custom:essai-de-code-card
 *   title: Salon
 *   entity: sensor.temperature_salon
 *   icon: mdi:thermometer
 *
 */

class EssaiDeCodeCard extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
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

    // On récupère les éléments HTML dont on aura besoin
    this._title = this.shadowRoot.querySelector(".title");
    this._text = this.shadowRoot.querySelector(".text");
    this._icon = this.shadowRoot.querySelector("ha-icon");
  }


  // --------------------------------------------------------
  // CONFIGURATION
  // --------------------------------------------------------

  setConfig(config) {

    if (!config.entity) {
      throw new Error(
        "Il faut préciser une entité (entity: sensor.xxx)"
      );
    }

    this.config = config;

    this._render();
  }


  // --------------------------------------------------------
  // ÉTAT DE HOME ASSISTANT
  // --------------------------------------------------------

  set hass(hass) {

    this._hass = hass;

    this._render();
  }


  // --------------------------------------------------------
  // AFFICHAGE DE LA CARTE
  // --------------------------------------------------------

  _render() {

    // Si la configuration ou Home Assistant
    // ne sont pas encore disponibles
    if (!this.config || !this._hass) {
      return;
    }


    // ------------------------------------------------------
    // TITRE
    // ------------------------------------------------------

    this._title.textContent =
      this.config.title || "Essai de code";


    // ------------------------------------------------------
    // ICÔNE
    // ------------------------------------------------------

    // Si "icon:" existe dans le YAML,
    // on utilise cette icône.
    //
    // Sinon, on utilise mdi:eye.

    const icon =
      this.config.icon || "mdi:eye";

    this._icon.setAttribute("icon", icon);


    // ------------------------------------------------------
    // ENTITÉ
    // ------------------------------------------------------

    const entity =
      this._hass.states[this.config.entity];


    // Si l'entité n'existe pas
    if (!entity) {

      this._text.textContent =
        "Capteur introuvable";

      return;
    }


    // ------------------------------------------------------
    // VALEUR DU CAPTEUR
    // ------------------------------------------------------

    // entity.state contient la valeur du capteur.
    //
    // parseFloat transforme par exemple :
    //
    // "21.5"
    //
    // en :
    //
    // 21.5

    const valeur =
      parseFloat(entity.state);


    // ------------------------------------------------------
    // COMPARAISON
    // ------------------------------------------------------

    // Si la température est supérieure à 20
    if (valeur > 20) {

      this._text.textContent =
        "Il fait chaud";

    } else {

      this._text.textContent =
        "Il fait froid";

    }

  }


  // --------------------------------------------------------
  // TAILLE DE LA CARTE
  // --------------------------------------------------------

  getCardSize() {
    return 1;
  }

}


// ----------------------------------------------------------
// ENREGISTREMENT DU CUSTOM ELEMENT
// ----------------------------------------------------------

if (!customElements.get("essai-de-code-card")) {

  customElements.define(
    "essai-de-code-card",
    EssaiDeCodeCard
  );

}


// ----------------------------------------------------------
// INFORMATIONS POUR HOME ASSISTANT
// ----------------------------------------------------------

window.customCards =
  window.customCards || [];


if (
  !window.customCards.some(
    (card) =>
      card.type === "essai-de-code-card"
  )
) {

  window.customCards.push({

    type: "essai-de-code-card",

    name: "Essai de code",

    description:
      "Ma toute première carte, pour apprendre.",

    preview: true

  });

}
