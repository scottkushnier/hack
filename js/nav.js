"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage();
  if (currentUser) {
    showFavoriteStories();
  }
  $(".nav-link").removeClass("bold");
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $("#nav-login").addClass("bold");
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navUserProfile.text(`${currentUser.username}`);
  $navLogin.addClass("hide");
  $(".user-based").removeClass("hide");
  $(".trashcan").addClass("hide");
  $(".story-user").removeClass("nologin");
  $(".story-author").removeClass("nologin");
}

function updateNavOnLogout() {
  console.debug("updateNavOnLogout");
  $navLogin.removeClass("hide");
  $(".user-based").addClass("hide");
  hidePageComponents();
  putStoriesOnPage();
}

function navSubmit() {
  console.debug("navSubmit");
  hidePageComponents();
  $submitForm.show();
  $(".nav-link").removeClass("bold");
  $navSubmit.addClass("bold");
}

$navSubmit.on("click", navSubmit);

/*---------------------------------------------------------------------*/

function navFavStories(evt) {
  console.debug("navFavStories");
  hidePageComponents();
  putStoriesOnPage(favStories());
  showFavoriteStories();
  $(".nav-link").removeClass("bold");
  $navFavs.addClass("bold");
}

$navFavs.on("click", navFavStories);

/*---------------------------------------------------------------------*/

function navMyStories(evt) {
  console.debug("navMyStories");
  hidePageComponents();
  putStoriesOnPage(myStories());
  showFavoriteStories();
  showTrashcans();
  $(".nav-link").removeClass("bold");
  $navMine.addClass("bold");
  $(".story-user").addClass("mylist");
  $(".story-author").addClass("mylist");
}

$navMine.on("click", navMyStories);
