
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import * as use from "@tensorflow-models/universal-sentence-encoder";

let model: any;
let initialized = false;

async function getModel() {
  if (!initialized) {
    await tf.setBackend("cpu");
    await tf.ready();

    model = await use.load();
    initialized = true;
  }

  return model;
}

export async function generateEmbedding(text: string) {
  const model = await getModel();
  const tensor = await model.embed([text]);

  try {

    return Array.from<number>(await tensor.data());
  } finally {
    tensor.dispose();
  }
}
