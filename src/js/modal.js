import { el } from "./dom";

export function openModal(contentElement, onClose) {
  document.body.classList.add("modal-open");

  const closeModal = () => {
    modalOverlay.remove();
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleEsc);
    if (typeof onClose === "function") onClose();
  };

  const handleEsc = (event) => {
    if (event.key === "Escape") closeModal();
  };
  document.addEventListener("keydown", handleEsc);

  const closeBtn = el("button", {
    className: "modal-close-btn",
    textContent: "✕",
    "aria-label": "Close modal",
    onClick: closeModal,
  });

  const modalContent = el(
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
  );
  document.body.appendChild(modalOverlay);

  return closeModal;
}
