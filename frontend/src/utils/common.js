export function addClass(dom, className) {
  const classList = dom.classList;
  if (!classList.contains(className)) {
    classList.add(className);
  }
}

export function removeClass(dom, className) {
  const classList = dom.classList;
  if (classList.contains(className)) {
    classList.remove(className);
  }
}