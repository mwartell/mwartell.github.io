---
title: a clear shortcut
layout: post
category: tools
---

When sharing terminal screens in video conferencing, I often see
people typing

    clear

in the shell to clear the screen. There is a better way.

Since as long as I can remember, possibly dating back to the
advent of GNU Bash and its [readline][readline] line editor, Ctrl-L
has been present to clear the screen. To use it, press

    Ctrl-L

or, on macOS, I guess,

    ⌘-L

that's the Control or Command key along with the letter L.

The historically minded will remember that Ctrl-L is the ␌
ASCII form-feed character that would eject a page when sent
to a Teletype.

[readline]: https://en.wikipedia.org/wiki/GNU_Readline
