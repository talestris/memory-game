export function el(tagName, attributes = {}, ...children) {
  const element = document.createElement(tagName);

  for (const [key, value] of Object.entries(attributes)) {
    if (!value && value !== 0) continue;

    if (key === "className" || key === "class") {
      element.className = value;
    } else if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.toLowerCase().substring(2);
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  }

  children.forEach((child) => {
    if (typeof child === "string" || typeof child === "number") {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  });

  return element;
}
