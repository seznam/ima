import { AbstractExtension } from '@ima/core';

export default class TestExtension extends AbstractExtension {
  static get $dependencies() {
    return [];
  }

  load() {
    let { cards } = this.getState();
    cards.then(cards => {
      cards[1].title = 'Extension2';
    });
    return { editedCards: cards };
  }
}
