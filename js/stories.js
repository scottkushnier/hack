"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  // const date = new Date(story.createdAt) + "";
  // const dateString = date.slice(0, 24);
  const hide = currentUser ? "" : "hide";
  return $(`
      <li id="${story.storyId}">
        <span class="trashcan user-based hide">
        <i class="far fa-trash-alt"></i>
        </span>
        <span class="star user-based ${hide}">
          <i class="far fa-star"></i>
        </span>

        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <span class="story-hostname">(${hostName})</span>
        <span class="story-author">by ${story.author}</span>
        <span class="story-user">posted by ${story.username}</span>
      </li>
      <hr>
    `);
}

// <small><span class="date">(${dateString})</span></small>

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(storiesSent) {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();
  const stories = storiesSent ? storiesSent : storyList.stories;
  // console.log("stories", stories);
  if (stories.length === 0) {
    console.log("no stories");
    $allStoriesList.append("<small>(no stories to show)</small>");
  }
  // loop through all of our stories and generate HTML for them
  for (let story of stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  $(".star").click(function (e) {
    clickStar(e);
  });
  if (currentUser === undefined) {
    $(".story-user").addClass("nologin");
    $(".story-author").addClass("nologin");
  }
}

function favStories() {
  const favorites = currentUser.favorites.map((story) => story.storyId);
  const favs = storyList.stories.filter((story) =>
    favorites.includes(story.storyId)
  );
  return favs;
}

function myStories() {
  const myStories = storyList.stories.filter(
    (story) => story.username === currentUser.username
  );
  return myStories;
}

function showTrashcans() {
  $(".trashcan").removeClass("hide");
  $(".trashcan").click(function (e) {
    clickTrash(e);
  });
}

async function submitStory(evt) {
  console.debug("submit story");
  evt.preventDefault();

  const author = $("#submit-author").val();
  const title = $("#submit-title").val();
  let url = $("#submit-url").val();
  if (!url.includes("//")) {
    url = "http://" + url;
  }
  /* check story details */
  if (author === "") {
    alert("Need to supply AUTHOR");
    return;
  }
  if (title === "") {
    alert("Need to supply TITLE");
    return;
  }
  if (!url.includes(".")) {
    alert("Invalid URL");
    return;
  }

  // make sure logged in before submit
  if (currentUser === undefined) {
    alert("Please login to submit a story.");
    return;
  }

  console.log(author, title, url);
  const story = new Story({ author, title, url });
  story.username = currentUser.username;
  console.log(story);
  $("#submit-status").html("Submitting &hellip;");
  const newStory = await storyList.addStory(currentUser.username, story);
  // await sleep(2000);
  $("#submit-status").text("Submitted.");
  setTimeout(function () {
    $("#submit-status").html("&nbsp;");
  }, 5000);
  storyList.stories.unshift(newStory);
}

$submitForm.on("submit", submitStory);

function digOutStory(storyId, list) {
  return list.filter((story) => story.storyId === storyId)[0];
}

const iconInfo = {
  star: "far fa-star",
  solidstar: "fas fa-star",
  trashcan: "far fa-trash-alt",
  stopwatch: "fas fa-stopwatch",
  all: "fas far fa-star fa-trash-alt fa-stopwatch",
};

function changeToIcon(iTag, iconName) {
  // console.log("iTag", iTag);
  iTag.removeClass(iconInfo.all);
  iTag.addClass(iconInfo[iconName]);
}

function liForClick(e) {
  if (e.target.tagName === "I") {
    return e.target.parentElement.parentElement;
  } else if (e.target.tagName === "SPAN") {
    return e.target.parentElement;
  }
}

function iTagIsHollowStar(iTag) {
  return iTag.hasClass("far");
}

function setupTimeOutIcon(promise, iTag, waitIcon, timeout) {
  let finished = false;
  promise.then(function () {
    // console.log("promise finished");
    finished = true;
  });
  setTimeout(function () {
    if (!finished) {
      changeToIcon(iTag, waitIcon);
    }
  }, timeout);
}

async function clickStar(e) {
  console.debug("click star");
  if (currentUser === undefined) {
    return;
  }
  const li = liForClick(e);
  const storyId = li.id;
  const story = digOutStory(storyId, storyList.stories);
  const iTag = $(li).find(".star").find("I");
  // console.log("iTag", iTag);

  if (iTagIsHollowStar(iTag)) {
    // toggle to "favorite"
    console.log("fav on");
    const promise = currentUser.markFavStory(story);
    setupTimeOutIcon(promise, iTag, "stopwatch", 200);
    await promise;
    changeToIcon(iTag, "solidstar");
  } else {
    // toggle to "not a favorite"
    console.log("fav off");
    const promise = currentUser.markNotFavStory(story);
    setupTimeOutIcon(promise, iTag, "stopwatch", 200);
    await promise;
    changeToIcon(iTag, "star");
  }
}

async function clickTrash(e) {
  console.debug("click trash");
  const li = liForClick(e);
  const iTag = $(li).find(".trashcan").find("I");
  // console.log("iTag", iTag);
  // console.log("tgt:", li);
  const story = digOutStory(li.id, storyList.stories);
  const promise = deleteStory(story);
  setupTimeOutIcon(promise, iTag, "stopwatch", 200);
  await promise;
  console.log(story);
  storyList.stories = removeStoryFromList(story, storyList.stories);
  const hr = li.nextElementSibling; // remove line below story li
  hr.remove();
  li.remove();
  if ($("li").length === 0) {
    console.log("no stories");
    $allStoriesList.append("<small>(no stories to show)</small>");
  }
}

function showFavoriteStories() {
  console.debug("show favorite stories");
  const favorites = currentUser.favorites;
  favorites.forEach(function (favorite) {
    const li = $(`#${favorite.storyId}`);
    const iTag = li.find(".fa-star");
    changeToIcon(iTag, "solidstar");
  });
}
