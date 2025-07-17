# Frontend Technical Assessment

_Author: Matteo Buffo_

## Installation

Follow these steps to clone the repository and install the dependencies.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Clone the repository

```bash
git clone https://github.com/MatteoBuffo/autocomplete-assignment.git
```

### Navigate to the project directory

```bash
cd your-repo-name
```

### Install dependencies

```bash
npm install
```

## Run

This project runs as a standard React app.

```bash
npm start
```

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Personal considerations

### Auto-complete component development

The final app consists of three top-level pieces (in `App.tsx`):

1. the page title;
2. a pair of radio buttons that lets the user choose between the local and remote data source;

   | Data Source | Data                                  | Type of returned Users |
   |-------------|---------------------------------------|------------------------|
   | Local       | Array of users from `data/users.json` | `LocalUser`            |
   | Remote      | Array of GitHub users                 | `RemoteUser`           |

3. the required auto-complete component.

The first two parts are totally optional and can be commented out if needed. When using remote data,
fetched `RemoteUser`s are mapped to `LocalUser`s to conform to the auto-complete logic.

The initial design and development of the auto-complete component steps were quite
straightforward. As the component complexity grew, I refactored it in smaller parts to maintain the
code clean, organized and maintainable.

In addition to the required features, I implemented the following enhancements.

+ **Loading and error**\
  Acknowledging that requests may be delayed or fail, whether intentionally or not, `loading` and `error` states are
  there to manage and display
  the request status effectively. Additionally, the `error` state can be simulated by typing `"err"` in
  the
  auto-complete input field.
+ **Retry logic**\
  If a request fails, the user can retry it by pressing the Retry button shown with the error message. This allows the
  user to trigger a new request without changing the search term.
+ **Debouncing**\
  The request (be it local or remote) is not sent at every input change, but is instead delayed until the user has
  stopped typing for a specified period (by default, 500 ms). This significantly improves performance by reducing the
  number of
  unnecessary requests.
+ **URL encoding**\
  The remote request URL is safely constructed using `encodeURIComponent` to ensure that special characters in the
  search
  term are correctly encoded. This prevents malformed URLs and avoids errors or unintended
  behaviors when making requests.
+ **Smart results sorting**\
  The query results are sorted so that entries beginning with the search term appear before those that only contain the
  term. This approach helps users find the desired entry more quickly.\
  For example, suppose we are searching for the user named **Laura**, and we start typing `"la"` in the autocomplete
  input. Compare the sorting strategies below, focusing on where **Laura** appears in the list.

  | Sorting strategy |                                                            Results                                                            | Laura's position |
  |------------------|:-----------------------------------------------------------------------------------------------------------------------------:|:----------------:|
  | None             | <img alt="Results of no sorting." src="readme\images\sort_none.png" title="sort-none" width="75%"/>                           |       6th        |
  | Alphabetical     | <img alt="Results of alphabetical sorting." src="readme\images\sort_alphabetical.png" title="sort_alphabetical" width="75%"/> |       7th        |
  | Smart            | <img alt="Results of smart sorting." src="readme\images\sort_smart.png" title="sort-smart" width="75%"/>                      |       1st        |

### Edge use-cases and UX

Since several edge use-cases emerged while stress-testing the app, this section took a significant portion of the time I
spent on the assignment. Below is a list of design choices I
made to achieve a smooth and user-friendly experience.

+ **Request cancellation**\
  In-flight requests are canceled if the search term changes while a response is still pending. This prevents outdated
  results from being displayed and avoids potential race conditions.

+ **Accessibility**
    + The web page is fully navigable using only the keyboard, ensuring accessibility for users who
      cannot or prefer not to use a mouse. In particular:
        + the `Up` and `Down` arrow keys navigate the query result entries in a
          circular way (that is, the last/first entry gets highlighted when the user reaches the top/bottom of the
          list);
        + the `Enter`/`Return` key submits the currently focused result entry, unless the search term already matches it
          exactly;
        + the `Esc` key closes the results dropdown.

    + ARIA roles and attributes are there to improve accessibility.
    + Only the first `limit` request results are shown (by default, `limit`=8) and not all. In this way, all the entries
      are fully
      visible within the dropdown, eliminating the need for
      inline scrolling.
    + The results dropdown style does not cause a shift in the elements following
      the autocomplete component. Instead, those elements are hidden by the dropdown.

+ **Mobile browsers**\
  I stress-tested the web app not only by manually resizing the browser window on desktop, but also by testing it
  directly on my phone. During this testing phase, I made several adjustments to improve the mobile UX, both in portrait
  and
  landscape orientations.
    + Depending on the phone operating system, the virtual keyboard shows a dedicated UI element (e.g. a magnifying
      glass
      or Search/Go button) instead of the default Enter/Return key.
    + When the user presses the search button, the virtual keyboard is dismissed. Although the input field loses focus,
      the auto-complete results remain visible. The results are hidden only when the user clicks outside the input field
      or the results dropdown.
    + Again, the natural height of the results list is a choice that makes the component manageable and pleasant also on
      mobile screen sizes.
