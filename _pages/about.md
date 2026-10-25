---
layout: about
title: about
permalink: /

profile:
  align: right
  image: ivc_lab_logo.png
  image_circular: false # crops the image to make it circular

selected_papers: false # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 8 # leave blank to include all the news in the `_news` folder
---
<style>
/* News section: scroll only when content overflows */
.news {
  max-height: 320px !important;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(128, 128, 128, 0.9) transparent;
}
.news .table-responsive {
  max-height: none !important;
}
/* News titles: plain black, no visited color change */
.news .news-title,
.news .news-title:visited {
  color: inherit;
}
.news .news-title:hover {
  color: inherit;
  text-decoration: underline;
}
.news::-webkit-scrollbar {
  width: 6px;
}
.news::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.9);
  border-radius: 4px;
}
.news::-webkit-scrollbar-track {
  background: transparent;
}

/* Force pure black text on homepage (light mode only) */
.post > article,
.post > article p,
.post > article div[data-lang],
.post > article h1,
.post > article h2,
.post > article h3,
.post > article h4,
.post > article .news-title,
.post > article .news-title:visited,
.post > article .news-title:hover {
  color: #000;
}
/* In dark mode, restore default light text color */
[data-theme="dark"] .post > article,
[data-theme="dark"] .post > article p,
[data-theme="dark"] .post > article div[data-lang],
[data-theme="dark"] .post > article h1,
[data-theme="dark"] .post > article h2,
[data-theme="dark"] .post > article h3,
[data-theme="dark"] .post > article h4,
[data-theme="dark"] .post > article .news-title,
[data-theme="dark"] .post > article .news-title:visited,
[data-theme="dark"] .post > article .news-title:hover {
  color: inherit;
}

/* EN-zh bio blocks stack in one grid cell at all screen sizes; the inactive
   block stays laid out (visibility:hidden) so the section height is reserved
   by the longer (EN) text and toggling languages never shifts the page.
   Overwrites lang.js's display:none rule via higher specificity. */
.bio-i18n {
  display: grid;
}
.bio-i18n > [data-lang] {
  grid-area: 1 / 1;
}
html[data-lang="en"] .bio-i18n > [data-lang="zh"],
html[data-lang="zh"] .bio-i18n > [data-lang="en"] {
  display: block !important;
  visibility: hidden;
}

/* Desktop two-column grid: bio text col 1 (1fr), profile logo col 2 (fixed 320px) */
@media (min-width: 768px) {
  .post > article {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 0 2rem;
  }
  /* Bio container: col-1 */
  .post > article > .bio-i18n {
    grid-column: 1;
    grid-row: 1;
  }
  /* Profile: col-2, override theme's .profile{width:30%}, vertically centered */
  .post > article > .profile.float-right {
    float: none;
    width: 100% !important;
    grid-column: 2;
    grid-row: 1;
    align-self: center;
  }
  /* All later sections span both columns */
  .post > article > h2,
  .post > article > .news,
  .post > article > .publications,
  .post > article > .social {
    grid-column: 1 / -1;
  }
  /* Center the crop-marked figure + logo image inside the profile div */
  .post > article > .profile.float-right > figure {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }
  .post > article > .profile.float-right > figure img {
    width: 100%;
    height: auto;
  }
  .post > article > h2:first-of-type {
    margin-top: 1rem;
  }
}
</style>

<div class="bio-i18n">
<div data-lang="en">
Write your biography here. Tell the world about yourself. Link to your favorite [subreddit](https://www.reddit.com). You can put a picture in, too. The code is already in, just name your picture `prof_pic.jpg` and put it in the `img/` folder.

Put your address / P.O. box / other info right below your picture. You can also disable any of these elements by editing `profile` property of the YAML header of your `_pages/about.md`. Edit `_bibliography/papers.bib` and Jekyll will render your [publications page](/publications/) automatically.

Link to your social media connections, too. This theme is set up to use [Font Awesome icons](https://fontawesome.com/) and [Academicons](https://jpswalsh.github.io/academicons/), like the ones below. Add your Facebook, Twitter, LinkedIn, Google Scholar, or just disable all of them.

</div>

<div data-lang="zh">待写入

</div>
</div>
