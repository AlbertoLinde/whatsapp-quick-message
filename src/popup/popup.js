document.addEventListener('DOMContentLoaded', function () {
  const userLang = navigator.language || navigator.userLanguage;
  const lang = userLang.startsWith('es') ? 'es' : 'en';

  const messageContainer = document.getElementById('message-container');
  const toggleMessageBtn = document.getElementById('toggleMessage');
  const sendMessageBtn = document.getElementById('sendMessage');
  const phoneInput = document.getElementById('phone');

  fetch(`/locales/${lang}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(translations => {
      document.title = translations.title;
      document.querySelector('h1').textContent = translations.title;
      document.querySelector('label[for="phone"]').textContent = translations.phone_label;
      phoneInput.placeholder = translations.phone_placeholder;
      document.querySelector('.hint').textContent = translations.hint;
      toggleMessageBtn.textContent = translations.add_message;
      document.querySelector('label[for="message"]').textContent = translations.message_label;
      sendMessageBtn.textContent = translations.send_button;

      toggleMessageBtn.addEventListener('click', function () {
        if (messageContainer.style.display === 'none') {
          messageContainer.style.display = 'block';
          this.textContent = translations.remove_message;
        } else {
          messageContainer.style.display = 'none';
          this.textContent = translations.add_message;
        }
      });

      phoneInput.addEventListener('input', function () {
        if (validatePhoneNumber(phoneInput.value.trim())) {
          sendMessageBtn.disabled = false;
        } else {
          sendMessageBtn.disabled = false;
        }
      });

      sendMessageBtn.addEventListener('click', function () {
        const phoneNumber = phoneInput.value.trim();
        let message = '';

        if (messageContainer.style.display !== 'none') {
          message = document.getElementById('message').value.trim();
        }

        let whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;
        if (message) {
          whatsappUrl += `?text=${encodeURIComponent(message)}`;
        }
        chrome.tabs.create({ url: whatsappUrl });
      });
    })
    .catch(error => {
      console.error('Failed to load translations:', error);
    });

  function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{8,15}$/;
    return phoneRegex.test(phoneNumber);
  }
});
