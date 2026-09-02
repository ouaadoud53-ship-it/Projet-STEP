export function showAlert(kind: 'info' | 'success' | 'error', title: string, message?: string) {
  const header = kind === 'error' ? 'Erreur' : kind === 'success' ? 'Succès' : 'Info';
  const body = message ? `\n\n${message}` : '';
  // Non-blocking fallback: log to console. Replace this with a toast system if desired.
  if (kind === 'error') console.error(`${header} — ${title}${body}`);
  else if (kind === 'success') console.log(`${header} — ${title}${body}`);
  else console.info(`${header} — ${title}${body}`);
}

export function showError(title: string, message?: string) {
  showAlert('error', title, message);
}

export function showInfo(title: string, message?: string) {
  showAlert('info', title, message);
}

export function showSuccess(title: string, message?: string) {
  showAlert('success', title, message);
}
