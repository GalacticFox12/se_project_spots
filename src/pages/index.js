import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  toggleButtonState,
  disableBtn,
} from "../scripts/validation.js";
import { setBtnText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const profileAvatar = document.querySelector(".profile__avatar");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarForm = avatarModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const deleteModal = document.querySelector("#delete-modal");
const deleteModalBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(
  ".modal__submit-btn_cancel"
);
const deleteForm = deleteModal.querySelector(".modal__form");

let selectedCard, selectedCardId;

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "8606b4ad-2d31-4218-96cb-6012d27d651f",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })
  .catch((err) => {
    console.error(err);
  });

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  if (data.isLiked === true) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }
  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data._id));

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(event) {
  if (event.key === "Escape") {
    closeModal(document.querySelector(".modal_is-opened"));
  }
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-btn_active");
  api
    .changeLikeStatus(id, isLiked)
    .then((res) => {
      evt.target.classList.toggle("card__like-btn_active", res.status);
    })
    .catch(console.error);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  toggleButtonState(
    [editProfileNameInput, editProfileDescriptionInput],
    editProfileSubmitBtn,
    settings
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

newPostModal.addEventListener("click", function (evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(newPostModal);
  }
});

editProfileModal.addEventListener("click", function (evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(editProfileModal);
  }
});

previewModal.addEventListener("click", function (evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(previewModal);
  }
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

avatarModal.addEventListener("click", function (evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(avatarModal);
  }
});

deleteModalBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

deleteModal.addEventListener("click", function (evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(deleteModal);
  }
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      disableBtn(submitBtn);
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}

avatarForm.addEventListener("submit", handleAvatarSubmit);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true);
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true);
  const inputValues = {
    name: newPostCaptionInput.value,
    link: newPostLinkInput.value,
  };

  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      disableBtn(newPostSubmitBtn, settings);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}

newPostForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
