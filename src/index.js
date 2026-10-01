document.querySelectorAll('.show-all').forEach((button) => {
  button.addEventListener('click', () => {
    const section = button.closest('.expandable');
    const isExpanded = section.classList.toggle('expandable_expanded');

    button.classList.toggle('show-all_open', isExpanded);
    button.setAttribute('aria-expanded', String(isExpanded));

    const buttonText = button.querySelector('.show-all__text');
    const collapsedText = button.dataset.collapsedText || 'Показать все';
    const expandedText = button.dataset.expandedText || 'Скрыть';

    buttonText.textContent = isExpanded ? expandedText : collapsedText;
  });
});

const sidebar = document.querySelector('.sidebar');
const sidebarOpenButton = document.querySelector('.header__button_type_burger');
const sidebarCloseButton = document.querySelector('.sidebar__close');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

if (sidebar && sidebarOpenButton && sidebarCloseButton && sidebarOverlay) {
  const desktopMedia = window.matchMedia('(min-width: 1366px)');

  const setSidebarState = (isOpen, moveFocus = true) => {
    const shouldOpen = desktopMedia.matches || isOpen;
    const shouldShowOverlay = shouldOpen && !desktopMedia.matches;

    sidebar.classList.toggle('sidebar_open', shouldOpen);
    sidebarOverlay.classList.toggle('sidebar-overlay_visible', shouldShowOverlay);
    document.body.classList.toggle('page_sidebar-open', shouldShowOverlay);

    sidebar.setAttribute('aria-hidden', String(!shouldOpen));
    sidebarOpenButton.setAttribute('aria-expanded', String(shouldOpen));

    if (!moveFocus || desktopMedia.matches) {
      return;
    }

    if (shouldOpen) {
      sidebarCloseButton.focus();
    } else {
      sidebarOpenButton.focus();
    }
  };

  sidebarOpenButton.addEventListener('click', () => setSidebarState(true));
  sidebarCloseButton.addEventListener('click', () => setSidebarState(false));
  sidebarOverlay.addEventListener('click', () => setSidebarState(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !desktopMedia.matches && sidebar.classList.contains('sidebar_open')) {
      setSidebarState(false);
    }
  });

  desktopMedia.addEventListener('change', () => setSidebarState(false, false));
  setSidebarState(false, false);
}

const modalConfigs = {
  feedback: document.querySelector('.feedback-modal-layer'),
  call: document.querySelector('.call-modal-layer'),
};

let activeModalName = null;
let activeModalTrigger = null;

const closeModal = (restoreFocus = true) => {
  if (!activeModalName) {
    return;
  }

  const activeLayer = modalConfigs[activeModalName];
  activeLayer.classList.remove(`${activeModalName}-modal-layer_open`);
  activeLayer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('page_modal-open');

  if (restoreFocus && activeModalTrigger) {
    activeModalTrigger.focus();
  }

  activeModalName = null;
  activeModalTrigger = null;
};

const openModal = (modalName, trigger) => {
  const layer = modalConfigs[modalName];

  if (!layer) {
    return;
  }

  closeModal(false);

  if (!window.matchMedia('(min-width: 1366px)').matches) {
    sidebar?.classList.remove('sidebar_open');
    sidebar?.setAttribute('aria-hidden', 'true');
    sidebarOverlay?.classList.remove('sidebar-overlay_visible');
    sidebarOpenButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('page_sidebar-open');
  }

  activeModalName = modalName;
  activeModalTrigger = trigger;
  layer.classList.add(`${modalName}-modal-layer_open`);
  layer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('page_modal-open');
  layer.querySelector('.modal-close')?.focus();
};

document.querySelectorAll('[data-modal-open]').forEach((button) => {
  button.addEventListener('click', () => {
    openModal(button.dataset.modalOpen, button);
  });
});

Object.entries(modalConfigs).forEach(([modalName, layer]) => {
  if (!layer) {
    return;
  }

  layer.querySelector('.modal-close')?.addEventListener('click', () => closeModal());

  layer.addEventListener('click', (event) => {
    if (event.target === layer && activeModalName === modalName) {
      closeModal();
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeModalName) {
    closeModal();
  }
});

document.querySelectorAll('.modal-form').forEach((form) => {
  form.addEventListener('submit', (event) => event.preventDefault());
});
