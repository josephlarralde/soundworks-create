import chalk from 'chalk';

// create some contexts
class Layout {
  constructor(client) {
    this.client = client;
    this.components = new Set();
  }

  addComponent(comp) {
    this.components.add(comp);
    this.render();
  }

  deleteComponent(comp) {
    this.components.delete(comp);
    this.render();
  }

  render() {
    this.components.forEach(comp => {
      console.log(chalk.yellow(`[${this.client.type} ${this.client.id}]`), comp.render());
    });
  }
};

export default function createLayout(client) {
  const $layout = new Layout(client);
  return $layout;
}
