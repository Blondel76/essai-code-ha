class EssaiDeCodeCard extends HTMLElement {

  constructor() {
    super();

    this.innerHTML = `
      <div>
        Bonjour !
      </div>
    `;
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Configuration manquante");
    }

    this.config = { ...config };
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    return 1;
  }

}

customElements.define("essai-de-code", EssaiDeCodeCard);
window.customCards = window.customCards || [];

window.customCards.push({
  type: "essai-de-code",
  name: "Essai de code",
  description: "Ma première carte Home Assistant",
  preview: true,
});
