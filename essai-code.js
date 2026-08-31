/*
 * ==========================================================
 * MA PREMIÈRE CARTE — ÉTAPE 4 : AJOUTER UNE ICÔNE
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


  // Home Assistant nous donne la configuration YAML
  setConfig(config) {

    if (!config.entity) {
