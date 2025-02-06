---
title: making python packages the modern way
categories: tools packaging
---

I've not found a place where this is described clearly. You have to make a Python **package** and then you can import that directly by name.

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

To create a submodule in `octavius/friends` just create the directory and put an empty `__init__.py` to mark it as a module. Then, with `octavius/friends/mary.py` you could import that with

    from octavius.friends import mary
    print(f"mary.hobbies()=}")

## a big caution

If you are missing a build system in your `pyproject.toml` you will not be able to
import your package. Unfortunately, `uv` gives no indication that anything is wrong, you
will just get an `ImportError` when you try to import your package.

    [build-system]
    requires = ["hatchling"]
    build-backend = "hatchling.build"

You can confirm that `uv` has installed your package with

    uv pip list | grep octavius
