import { el } from "./dom";

export function openModal(contentElement, onClose) {
  document.body.classList.add("modal-open");

  const closeBtn = el(
    "button",
    {
      className: "modal-close-btn",
      "aria-label": "Close modal",
      onClick: () => dialog.close(),
    },
    "✕",
  );

  const dialogContent = el(
    "div",
    { className: "modal-content" },
    closeBtn,
    contentElement,
  );

  const dialog = el(
    "dialog",
    {
      className: "game-dialog",
      onClick: (event) => {
        if (event.target === dialog) {
          dialog.close();
        }
      },
      onClose: () => {
        document.body.classList.remove("modal-open");
        dialog.remove();
        if (typeof onClose === "function") onClose();
      },
    },
    dialogContent,
  );

  document.body.appendChild(dialog);
  dialog.showModal();

  return () => dialog.close();
}
