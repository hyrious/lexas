# LeXaS

A SPA playground.

*Notice*: pages below are using *inline-script*, which may be blocked
by uMatrix or other content-block plugins.

## Pages

- [OPG parser](opg.html)
- [Markdown to Discuz!bbcode](marked-discuz.html)
- [Pixiv profile banner generator](pixiv-profile-banner.html?id=23333)
- [QRCode Helper](qrcode.html)
- [MDP Robot](mdp.html)
- [Marked](marked.html)
- [404 Router](404.html)

## How it works

An HTML is enough for containing related resources, for example,
the [qrcode](qrcode.html).

Front-end is easy enough with huge amount of packages/libraries.
Thanks for CDN, we could build things by standing on the shoulders
of giants.

### [404 Router](https://hyrious.github.io/lexas/4040404)

This page takes the `window.location.pathname`, then looks for a
page closed to it and performs a redirection. It will be convenient
when not remembering the exact path of one page.

The difficulty comes from matching the page, we need tags for indexing
pages. It will be better to use it in blogs.

## License

WTFPLv2.
