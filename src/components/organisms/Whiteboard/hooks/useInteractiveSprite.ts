import type { Sprite, Container, FederatedPointerEvent } from "pixi.js";

export function useInteractiveSprite(id: string | undefined, onRemove?: (id: string) => void) {
  return {
    setup(sprite: Sprite) {
      let dragging = false;
      let offset = { x: 0, y: 0 };

      const onDown = (e: FederatedPointerEvent) => {
        dragging = true;
        const parent = sprite.parent as Container;
        const pos = e.getLocalPosition(parent);
        offset = { x: pos.x - sprite.x, y: pos.y - sprite.y };
        e.stopPropagation();
      };

      const onUp = () => { dragging = false };

      const onMove = (e: FederatedPointerEvent) => {
        if (!dragging) return;
        const parent = sprite.parent as Container;
        const pos = e.getLocalPosition(parent);
        sprite.position.set(pos.x - offset.x, pos.y - offset.y);
      };

      sprite.eventMode = "static";
      sprite.on("pointerdown", onDown);
      sprite.on("pointerup", onUp);
      sprite.on("pointerupoutside", onUp);
      sprite.on("pointermove", onMove);

      const onWheel = (ev: WheelEvent) => {
        const factor = ev.deltaY > 0 ? 0.95 : 1.05;
        sprite.scale.set(sprite.scale.x * factor);
      };

      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === "Delete" && id && onRemove) onRemove(id);
        if (ev.key === "ArrowLeft") sprite.rotation -= 0.05;
        if (ev.key === "ArrowRight") sprite.rotation += 0.05;
      };

      window.addEventListener("wheel", onWheel, { passive: true });
      window.addEventListener("keydown", onKey);

      return () => {
        sprite.off("pointerdown", onDown);
        sprite.off("pointerup", onUp);
        sprite.off("pointerupoutside", onUp);
        sprite.off("pointermove", onMove);

        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
      };
    }
  };
}
