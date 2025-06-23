'use strict';

// Utility function to toggle an element's class
const elementToggleFunc = (elem, className = "active") => {
  if (elem) elem.classList.toggle(className);
};

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle functionality
  const initSidebarToggle = () => {
    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");

    if (sidebarBtn && sidebar) {
      sidebarBtn.addEventListener("click", () => {
        elementToggleFunc(sidebar);
      });
    }
  };

  // Modal functionality
  const initModal = () => {
    const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
    const overlay = document.querySelector("[data-overlay]");
    const modalContainer = document.querySelector("[data-modal-container]");
    const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
    const modalImg = document.querySelector("[data-modal-img]");
    const modalTitle = document.querySelector("[data-modal-title]");
    const modalText = document.querySelector("[data-modal-text]");

    const testimonialsModalFunc = () => {
      elementToggleFunc(modalContainer);
      elementToggleFunc(overlay);
    };

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", testimonialsModalFunc);
    }
    if (overlay) {
      overlay.addEventListener("click", testimonialsModalFunc);
    }

    testimonialsItem.forEach((item) => {
      item.addEventListener("click", () => {
        const avatar = item.querySelector("[data-testimonials-avatar]");
        const title = item.querySelector("[data-testimonials-title]");
        const text = item.querySelector("[data-testimonials-text]");

        if (avatar && modalImg) {
          modalImg.src = avatar.src;
          modalImg.alt = avatar.alt;
        }
        if (title && modalTitle) {
          modalTitle.innerHTML = title.innerHTML;
        }
        if (text && modalText) {
          modalText.innerHTML = text.innerHTML;
        }

        testimonialsModalFunc();
      });
    });
  };

  // Navigation functionality
  const initNavigation = () => {
    const navigationLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");

    if (navigationLinks.length > 0 && pages.length > 0) {
      navigationLinks.forEach((link, index) => {
        link.addEventListener("click", () => {
          pages.forEach((page, pageIndex) => {
            if (link.innerHTML.toLowerCase() === page.dataset.page) {
              page.classList.add("active");
              navigationLinks[pageIndex].classList.add("active");
              window.scrollTo(0, 0);
            } else {
              page.classList.remove("active");
              navigationLinks[pageIndex].classList.remove("active");
            }
          });
        });
      });
    }
  };

  // Custom select functionality
  const initCustomSelect = () => {
    const select = document.querySelector("[data-select]");
    const selectItems = document.querySelectorAll("[data-select-item]");
    const selectValue = document.querySelector("[data-select-value]");
    const filterItems = document.querySelectorAll("[data-filter-item]");
    const filterBtn = document.querySelectorAll("[data-filter-btn]");

    const filterFunc = (selectedValue) => {
      filterItems.forEach((item) => {
        if (selectedValue === "all" || selectedValue === item.dataset.category) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    };

    if (select) {
      select.addEventListener("click", () => elementToggleFunc(select));
    }

    selectItems.forEach((item) => {
      item.addEventListener("click", () => {
        const selectedValue = item.innerText.toLowerCase();
        if (selectValue) selectValue.innerText = item.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
      });
    });

    // Filter buttons for large screens
    let lastClickedBtn = filterBtn[0];
    filterBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedValue = btn.innerText.toLowerCase();
        if (selectValue) selectValue.innerText = btn.innerText;
        filterFunc(selectedValue);

        if (lastClickedBtn) lastClickedBtn.classList.remove("active");
        btn.classList.add("active");
        lastClickedBtn = btn;
      });
    });
  };

  // Form validation functionality
  const initFormValidation = () => {
    const form = document.querySelector("[data-form]");
    const formInputs = document.querySelectorAll("[data-form-input]");
    const formBtn = document.querySelector("[data-form-btn]");

    if (form && formInputs.length > 0 && formBtn) {
      formInputs.forEach((input) => {
        input.addEventListener("input", () => {
          if (form.checkValidity()) {
            formBtn.removeAttribute("disabled");
          } else {
            formBtn.setAttribute("disabled", "");
          }
        });
      });
    }
  };

  // Initialize all functionalities
  initSidebarToggle();
  initModal();
  initNavigation();
  initCustomSelect();
  initFormValidation();
});