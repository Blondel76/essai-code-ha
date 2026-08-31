// Nom de la classe JavaScript
class EssaiDeCodeCard extends HTMLElement {

  constructor() {
    super();

    // Élément affiché dans la carte
    this.innerHTML = `
      <div>
        Bonjour !
      </div>
    `;
  }

  // Configuration de la carte
  setConfig(config) {
    this.config = config;
  }

}

// essai-de-code = nom du Custom Element
customElements.define("essai-de-code", EssaiDeCodeCard);
