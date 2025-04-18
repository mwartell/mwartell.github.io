---
title: making python packages the modern way
date: 2025-01-29
tags: python packaging
---


Although the [uv package and project management tool][uv] has been taking the Python
community by storm, I've found its documentation to be annoying incomplete. This
is the first in a series of notes that I'm writing to address some places of chronic
misunderstandings I've seen in the community.

The first of these is how to handle imports within the package being written under
uv. I've not found a place where this is described clearly and adds to the longstanding
Python problems of getting relative imports correct.

If you are developing a Python package to be used by others you have to make a Python
**package** and then you can import that directly by name. In practice, I've found
it worthwhile to start every project as a package because the little extra mechanism
added at the start makes later distribution effortless.

The command `uv init --package octavius` will create a package structure containing

    octavius/
    ├── pyproject.toml
    └── src
        └── octavius
            └── __init__.py

Then, if you `cd octavius` and `uv sync` the package `octavius` will be installed into
your virtualenv.

You have created a package octavius and you can import it directly in your notebooks like:

    import octavius

Now, if I create `octavius/toys.py` with a function `lego` in it. I could then

    from octavius import toys
    toys.lego()

or similar.

To create a submodule in `octavius/friends` just create the directory and put an empty
`__init__.py` to mark it as a module. Then, with `octavius/friends/mary.py` you could
import that with

    from octavius.friends import mary
    print(f"mary.{hobbies()=}")

## a big gotcha

If you are missing a build system in your `pyproject.toml` you will not be able to
import your package. Unfortunately, `uv` gives no indication that anything is wrong, you
will just get an `ImportError` when you try to import your package.

    [build-system]
    requires = ["hatchling"]
    build-backend = "hatchling.build"

You can confirm that `uv` has installed your package with

    uv pip list | grep octavius
