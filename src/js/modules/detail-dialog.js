let dialog;
let content;
let opener;

export function initDialog() {
  dialog = document.getElementById('detail-dialog');
  content = dialog?.querySelector('[data-dialog-content]');
  if (!dialog || !content) return;

  dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-dialog-open');
    document.body.classList.remove('is-dialog-open');
    dialog.className = 'detail-dialog';
    content.querySelectorAll('video').forEach((video) => {
      video.pause();
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach((source) => source.removeAttribute('src'));
      video.load();
    });
    opener?.focus?.();
    opener = null;
  });
}

export function openDetail({ trigger, html, onOpen, variant }) {
  if (!dialog || !content) initDialog();
  if (!dialog || !content) return;
  opener = trigger || document.activeElement;
  dialog.className = 'detail-dialog' + (variant ? ` detail-dialog--${variant}` : '');
  content.innerHTML = html;
  document.documentElement.classList.add('is-dialog-open');
  document.body.classList.add('is-dialog-open');
  dialog.showModal();
  dialog.querySelector('[data-dialog-close]')?.focus();
  onOpen?.(content);
}
