import chalk from 'chalk';

// create some contexts
class Layout {
  constructor(client) {
    this.client = client;
    this.components = new Set();

    this.lastComponentOutput = new Map(); // <comp, lastStrValue>
  }

  addComponent(comp) {
    this.components.add(comp);
    this.render();
  }

  deleteComponent(comp) {
    this.components.delete(comp);
    this.render();
  }

  // mimic lit API
  requestUpdate() {
    this.render();
  }

  render() {
    this.components.forEach(comp => {
      const last = this.lastComponentOutput.get(comp);
      const value = comp.render ? comp.render() : comp;

      if (last !== value) {
        console.log(chalk.green(`[${this.client.type} ${this.client.id}]`), value);
        this.lastComponentOutput.set(comp, value);
      }
    });
  }
};

export default function createLayout(client) {
  const $layout = new Layout(client);
  return $layout;
}
