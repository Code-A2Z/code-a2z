export const openPopup = (url: string, target?: string, features?: string) => {
  const popup = openPopupUsingWindowOpen(url, target, features);
  if (typeof popup?.focus === 'function') {
    popup?.focus();
  } else {
    openPopupUsingTag(url);
  }
  return popup;
};

const openPopupUsingWindowOpen = (
  url: string,
  target?: string,
  features?: string
) => {
  return window.open(url, target, features);
};

const openPopupUsingTag = (url: string) => {
  const anchorElement = document.createElement('a');
  anchorElement.href = url;
  anchorElement.target = '_blank';
  anchorElement.rel = 'opener';
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  anchorElement.dispatchEvent(clickEvent);
};
