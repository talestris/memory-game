import { el } from "./dom";

export function openModal(contentElement, onClose) {
  document.body.classList.add("modal-open");

  /*const closeModal = () => {
    modalOverlay.remove();
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleEsc);
    if (typeof onClose === "function") onClose();
  };

  const handleEsc = (event) => {
    if (event.key === "Escape") closeModal();
  };
  document.addEventListener("keydown", handleEsc);*/

  const closeBtn = el("button", {
    className: "modal-close-btn",
    textContent: "✕",
    "aria-label": "Close modal",
    onClick: () => dialog.close(),
  });

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

  /*const modalContent = el(
    "div",
    {
      className: "modal-content",
      onClick: (e) => e.stopPropagation(),
    },
    closeBtn,
    contentElement,
  );

  const modalOverlay = el(
    "div",
    {
      className: "modal-overlay",
      onClick: closeModal,
    },
    modalContent,
  );*/
  document.body.appendChild(dialog);
  dialog.showModal();

  return () => dialog.close();
}
