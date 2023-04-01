import { createApp } from 'vue';

export default function createLayout(client, $container, vueAppComponent) {
  const layoutId = `${client.role}-${client.id}`;
  
  const app = createApp(vueAppComponent);
  app.provide('$client', client);
  app.mount($container);

  const $layout = document.querySelector(`#${layoutId}`);
  return $layout;
}
