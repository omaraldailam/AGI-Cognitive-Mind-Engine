/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

type NeuralEventListener<T = any> = (data: T) => void;

export class NeuralEventEmitter {
  private static listeners: Map<string, Set<NeuralEventListener>> = new Map();

  public static on<T = any>(event: string, listener: NeuralEventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  public static emit<T = any>(event: string, data: T): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h(data);
        } catch (err) {
          console.error(`Neural event error in ${event}:`, err);
        }
      });
    }
  }
}
