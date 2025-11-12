/**
 * Allows optional lazy insert to custom document element.
 */
// Allows custom insert using `styles.use({ target: this.shadowRoot })`;
function insertStyles(element, options) {
  const parent = options.target || document.head;

  parent.appendChild(element);
}

module.exports = insertStyles;
