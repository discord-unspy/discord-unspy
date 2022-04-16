// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  for (const type of ['chrome', 'node', 'electron']) {
    const element = document.getElementById(`${type}-version`);

    if (element !== null) element.innerText = process.versions[type];
  }
});
