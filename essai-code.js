/*
 * ==========================================================
 * MA PREMIÈRE CARTE — ÉTAPE 3 : LIRE UN VRAI CAPTEUR
 * ==========================================================
 *
 * Nouveauté : au lieu d'afficher un texte fixe, la carte va
 * lire la valeur d'un capteur que TU choisis en YAML :
 *
 *   type: custom:essai-de-code-card
 *   title: Salon
 *   entity: sensor.temperature_salon
 *
 * Et elle va se mettre à jour TOUTE SEULE dès que ce capteur
 * change de valeur dans Home Assistant — sans jamais recharger
 * la page.
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

    this._title = this.shadowRoot.querySelector(".title");
    this._text = this.shadowRoot.querySelector(".text");
  }

  setConfig(config) {
    /*
     * NOUVEAU : une vérification.
     * ----------------------------------------------------------
     * setConfig() n'est appelée qu'UNE FOIS, AVANT que hass ne
     * soit disponible. Donc à ce stade précis, impossible
     * d'aller lire la valeur du capteur — on ne fait ici que
     * vérifier que la config est valide, et on stocke.
     *
     * On en profite pour imposer que "entity" soit bien rempli :
     * si ce n'est pas le cas, on arrête tout avec une erreur
     * claire plutôt que de laisser la carte planter plus tard
     * avec un message obscur.
     */
    if (!config.entity) {
      throw new Error("Il faut préciser une entité (entity: sensor.xxx)");
    }

    this.config = config;

    /*
     * On appelle quand même _render() ici : si "this._hass"
     * existe déjà (par exemple si tu modifies la config d'une
     * carte déjà affichée), autant rafraîchir tout de suite.
     * S'il n'existe pas encore, _render() va simplement ne
     * rien afficher pour l'instant (voir la vérification dans
     * _render()) — hass arrivera juste après.
     */
    this._render();
  }

  /*
   * set hass(hass)
   * ----------------------------------------------------------
   * LE POINT CLÉ DE CETTE ÉTAPE.
   *
   * Home Assistant appelle ce setter en continu — littéralement
   * plusieurs fois par seconde dans une maison active, dès
   * qu'UN SEUL capteur ou UNE SEULE lumière change d'état,
   * n'importe où dans la maison (pas seulement les tiens).
   *
   * "hass" est un immense objet JavaScript. La partie qui nous
   * intéresse est "hass.states", qui contient l'état ACTUEL de
   * absolument toutes les entités, sous la forme :
   *
   *   hass.states["sensor.temperature_salon"] = {
   *     state: "21.4",
   *     attributes: { unit_of_measurement: "°C", ... },
   *     ...
   *   }
   *
   * Comme hass arrive très souvent, on appelle _render() à
   * CHAQUE fois — c'est normal et voulu : c'est ce qui donne
   * l'impression que la carte "vit en direct".
   */
  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    /*
     * NOUVEAU : garde-fou.
     * ----------------------------------------------------------
     * On l'a dit : _render() peut être appelée AVANT que
     * this.config ou this._hass existent (l'ordre exact dans
     * lequel Home Assistant appelle setConfig() et hass() n'est
     * pas garanti à 100%). Sans cette vérification, la ligne
     * suivante planterait avec une erreur du type "Cannot read
     * properties of undefined".
     */
    if (!this.config || !this._hass) {
      return;
    }

    this._title.textContent = this.config.title || "Essai de code";

    /*
     * ALLER CHERCHER LE CAPTEUR
     * ----------------------------------------------------------
     * this.config.entity contient le nom de l'entité que TU as
     * écrit en YAML (ex: "sensor.temperature_salon").
     *
     * this._hass.states[...] permet d'aller chercher, dans le
     * grand objet "states", l'entrée qui correspond à ce nom.
     */
    const entity = this._hass.states[this.config.entity];

    /*
     * SÉCURITÉ : et si le capteur n'existe pas ?
     * ----------------------------------------------------------
     * Une faute de frappe dans le YAML, ou un capteur qui a été
     * supprimé/renommé, et "entity" vaudra "undefined". Sans
     * cette vérification, la ligne d'après planterait.
     */
    if (!entity) {
      this._text.textContent = "Capteur introuvable";
      return;
    }

    /*
     * entity.state contient TOUJOURS la valeur sous forme de
     * texte (même pour un nombre). "21.4" et non 21.4.
     * C'est pour ça que tes cartes précédentes utilisaient
     * parseFloat(entity.state) quand elles avaient besoin de
     * faire un calcul avec ce nombre. Ici, on veut juste
     * l'afficher, donc textContent suffit tel quel.
     */
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
