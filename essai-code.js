//nom de l'élément créé
class EssaiDeCodeCard extends HTMLElement {

  constructor() {
    super();

//Elément afficher dans la carte
    this.innerHTML = `
      <div>
        Bonjour !
      </div>
    `;
  }

}
//EssaiDeCodeCard c'est la classe javascript et essai-de-code nom utilisé dans le Yaml
customElements.define("Essai-De-Code", EssaiDeCodeCard);
