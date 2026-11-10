export function manageFocus(stage, isModal) {
  stage.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !isModal()) return;
    const overlay = [...stage.querySelectorAll('.overlay')].find((item) => !item.hidden);
    if (!overlay) return;
    const controls = [...overlay.querySelectorAll('button, input, select, a[href], [tabindex="0"]')]
      .filter((element) => !element.disabled && element.getClientRects().length && !element.closest('[hidden]'));
    if (!controls.length) return;
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });
}
