import { CompositionRoot } from "./shared/compositionRoot";

export async function bootstrap() {
  const compositionRoot = new CompositionRoot();

  await compositionRoot.start()
    .catch((error) => {
      console.error('Error starting application', error);
    });
}