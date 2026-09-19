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
    document.body.classList.remove('is-dialog-open');
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

export function openDetail({ trigger, html, onOpen }) {
  if (!dialog || !content) initDialog();
  if (!dialog || !content) return;
  opener = trigger || document.activeElement;
  content.innerHTML = html;
  document.body.classList.add('is-dialog-open');
  dialog.showModal();
  dialog.querySelector('[data-dialog-close]')?.focus();
  onOpen?.(content);
}
