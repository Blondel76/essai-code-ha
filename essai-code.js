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
    console.log("setConfig fonctionne !");
    console.log(config);
  }

}

customElements.define("essai-de-code", EssaiDeCodeCard);
