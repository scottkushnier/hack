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
  formatForLoggedInStories();
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

function formatForLoggedInStories() {
  $(".nav-link").removeClass("bold");
  $(".story-user").addClass("list_indent");
  $(".story-author").addClass("list_indent");
  $navLogin.addClass("hide");
  $navUserProfile.text(`${currentUser.username}`);
}

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".user-based").removeClass("hide");
  $(".trashcan").addClass("hide");
  formatForLoggedInStories();
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

function formatForFavStories() {
  $(".nav-link").removeClass("bold");
  $navFavs.addClass("bold");
  $(".story-user").addClass("list_indent");
  $(".story-author").addClass("list_indent");
}

function navFavStories(evt) {
  console.debug("navFavStories");
  hidePageComponents();
  putStoriesOnPage(favStories());
  showFavoriteStories();
  formatForFavStories();
}

$navFavs.on("click", navFavStories);

/*---------------------------------------------------------------------*/

function formatForMyStories() {
  $(".nav-link").removeClass("bold");
  $navMine.addClass("bold");
  $(".story-user").addClass("mylist_indent");
  $(".story-author").addClass("mylist_indent");
}

function navMyStories(evt) {
  console.debug("navMyStories");
  hidePageComponents();
  putStoriesOnPage(myStories());
  showFavoriteStories();
  showTrashcans();
  formatForMyStories();
}

$navMine.on("click", navMyStories);
