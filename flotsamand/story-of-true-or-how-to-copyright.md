---
title: "the story of true: or how to copyright nothing"
date: 2011-04-10
source: https://flotsamand.blogspot.com/2011/04/story-of-true-or-how-to-copyright.html
---

# the story of true: or how to copyright nothing

![I stole this logo off the net.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ4vMPkj7izfkXA1R8WSKUFcIs0B7cubJRyjMSMR92O92oJLs04r3KmJB1KqS74_duAxG8lvubc43DDVNRlRUcfHhX5SNMasy_NDIDbVxiCRYZhHqg2yBGKTz018dw3clIi2yo-57a1SM/s1600/Copyright_Cristal.png)

*I stole this logo off the net.*

I wish I could find an authoritative reference for this, but as will become clear, it is very hard to search for the relevant bits, so I'll just stroke my hypothetical grey beard and reminisce.

In Version 7 Unix, affectionately known as V7, there was a programmable shell interpreter known at the time as sh or what we now call the Bourne Shell because it was written by Steve Bourne of Bell Labs.

Although programmable, `sh` didn't have many intrinsics, in large part because memory on a PDP-11 was quite limited and added features would have made the shell too big when its primary purpose was as a user interface for entering commands. It is funny to think of a plain `$` as a user interface, but if you had seen the toggle switches, punch cards and Job Control Language contemporary to it, you probably would have been struck by the elegant improvement too.

The Bourne Shell had conditional constructs like `if` and `while` but it had a total lack of predicates by which to control a conditional. That was okay because Unix was great at plugging together programs and the `exit()` convention was already well established. When a program terminated, if everything was fine it called `exit(0)`, if any error happened it would exit with a non-zero status. The stage was set for constructs like:

```
if grep dixie /tmp/whistling
then
    echo I wish I was...
fi
```

which would, if "dixie" was contained in `whistling`, emit the first bar of lyrics. Just to put this accomplishment into perspective, the output of the echo command was probably sent to the 30 character per second teletypewriter that the shell script was executed from. Also, there was no need to put a file type like ".txt" on the end of a filename because in those days the file either contained ASCII text or it didn't; if it didn't contain text, you better know what program could interpret it or it might as well have been `/dev/null` as far as you were concerned.

So looking through a file for text was already taken care of, what if you wanted to know if a file simply existed or if you had permissions to write to it or various other simple predicates that mostly consisted of one system call to `stat(2)` and the proper extraction of results? So someone wrote the program named `test` which following the Unix tradition would accept option flags preceded by a dash (e.g. `-f` to see if a file existed) and the pathname to test. Unix already had hard links (or simply "links" as they were known then as symlinks had yet to be invented) so if you just linked the test program to the name `/bin/[` and changed test so if its last argument was ignored if it was "`]`" you could then write scripts like:

```
if [ -x /bin/echo ]
then
   echo I can talk
fi
```

Which made it look like the shell had intrinsic predicates. You could still use {{if test -x /bin/echo}} but the bracket command looked nicer. Yes, even echo was not a shell intrinsic then; did I mention keeping the shell small was important? As in 64KB for instruction and 64KB for data space maximum for the OS and the shell and programs that did actual work, important. And that was the whole address space for the machine, virtual addressing existed but not in a cheap (about $100k, inflation adjusted) minicomputer.

But what if you wanted an infinite loop in your shell script? The `while` construct was already in the shell, but how did you get a predicate that would always return 0 to its caller? Well the obvious solution would have been:

```
$ cat > true.c
main() { exit(0); }
$ cc -o /bin/true true.c
```

but once you link in the C runtime package and the system call interface, what looks like so little source code compiles into a not small binary that does essentially nothing. Oh yes, disk storage was also quite limited and very expensive. Could there be another mechanism that already existed which could be turned to this purpose but more efficiently?

It turned out there were two and only two types of executable files then. Unix binaries, produced by the linker which the `exec()` system call could identify because they began with a magic number meaning "I am a Unix executable binary". Everthing that didn't begin with that magic number would be presumed to be a Bourne shell script and a new shell would be forked to interpret it.

Following the Unix philosophy of "a program should behave in an expected fashion when given uncommon inputs", the shell itself had a convention on how to behave when handed an empty file to run as a script. It would do nothing and just return 0 (an empty script, by definition, contains no errors).

Using the tools of the time, `/bin/true` could be written with

```
$ cat /dev/null > /bin/true ; chmod 755 /bin/true
```

and, as expected, it was quite empty

```
$ ls -l /bin/true
-rwxr-xr-x 1 root 0 1982-03-19 18:46 /bin/true
$ cat /bin/true
$
```

But then as the 1970s slid into the 1980s, AT&T newly freed to sell things by the Bell System divestiture decided to make a product of their Unix and started stamping all system source files and shell scripts with big copyright banners. For some things this was pretty standard practice by 1984, but `/bin/true` which was kept around for compatibility's sake, became infinitely larger:

```
# Copyright 1984 AT&T Bell Laboratories Unix Systems Group.
# All rights reserved.
# Any copying of this program in violation of your License Agreement
# is Strictly Prohibited
# NO WARRANTY, EXPRESS OR IMPLIED, FOR ANY PURPOSE WHATSOEVER IS
# GRANTED BY THIS LICENSE
# Anyone who says otherwise is itchin' for a fight.
```

Okay, I pulled that from memory and made up what I didn't remember, but it was four lines long and was pure comments that were completely ignored by the shell followed by the full body of the original true script, which is to say, exactly nothing.

---

I am pleased to note that as of this writing, `true` has indeed kept pace with the times. On my current machine, `/bin/true` still exists but is now 18kB and links with a 1.4MB dynamically loaded library in order to run and makes two dozen system calls to do absolutely nothing. Well it does do something as it now takes option flags, too:

```
$ /bin/true --version
true (GNU coreutils) 8.5
Copyright (C) 2010 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Jim Meyering.
```

Which leaves me with two questions: who is Mr. Meyering and why did it take him at least eleven prior versions to get this program correct?

---

this article is copyright 2011 by matt wartell, anyone who says otherwise is itchin' for a fight
