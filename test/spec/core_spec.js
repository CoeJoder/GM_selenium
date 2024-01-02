/**
 * Functional tests for GM_selenium core module.
 */

const testDiv = document.createElement('div');
document.body.appendChild(testDiv);
let timeoutId;

const CONTENT_ID = 'content';
const CONTENT_TEXT = "Hello, Jasmine!";
const TIMEOUT_MESSAGE = "Spec timeout";
const SAMPLE_STYLESHEET = "https://fonts.googleapis.com/css?family=Open+Sans";
const ONE_SECOND = 1000;
const THREE_SECONDS = 3000;
const FIVE_SECONDS = 5000;
const ONE_MINUTE = 60000;

function clear() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = 0;
  }
  testDiv.innerHTML = '';
}

function createContent() {
  let p = document.createElement('p');
  p.setAttribute('id', CONTENT_ID);
  p.appendChild(document.createTextNode(CONTENT_TEXT));
  testDiv.appendChild(p);
}

function createContentIn(ms) {
  timeoutId = setTimeout(() => {
    createContent();
  }, ms);
}

/* specs defined below */

describe("GM_selenium", function () {
  let GM_selenium;

  beforeEach(function () {
    GM_selenium = window.GM_selenium;
  });

  it("should be assigned as a property of the `window` object", function () {
    expect(GM_selenium).toBeDefined();
  });

  describe("when waiting for element to be found", function () {
    beforeEach(function () {
      createContentIn(THREE_SECONDS);
    });

    afterEach(function () {
      clear();
    });

    it("should fail on timeout", async function () {
      await expectAsync(GM_selenium.wait({
        condition: () => document.getElementById(CONTENT_ID),
        timeout: ONE_SECOND,
        message: TIMEOUT_MESSAGE,
      })).toBeRejectedWithError(GM_selenium.TimeoutError, new RegExp(TIMEOUT_MESSAGE, 'g'));
    });

    it("should be found using a function-type condition", async function () {
      let content = await GM_selenium.wait({
        condition: () => document.getElementById(CONTENT_ID),
        timeout: FIVE_SECONDS,
      });
      expect(content).toBeDefined();
      expect(content.textContent).toEqual(CONTENT_TEXT);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function () {
  //     spyOn(song, 'persistFavoriteStatus');

  //     player.play(song);
  //     player.makeFavorite();

  //     expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

  // //demonstrates use of expected exceptions
  // describe("#resume", function () {
  //     it("should throw an exception if song is already playing", function () {
  //         player.play(song);

  //         expect(function () {
  //             player.resume();
  //         }).toThrowError("song is already playing");
  //     });
  // });
});
