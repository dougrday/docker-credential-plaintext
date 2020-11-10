# docker-credential-plaintext
A docker credential helper for plaintext storage of passwords. Use with caution.

# Installation

1. Clone the repository: `git clone https://github.com/dougrday/docker-credential-plaintext.git`
1. Add the folder to your system's PATH variable.
1. Update your Docker config, found at `%USERPROFILE%/.docker/config.json` in Windows, `~/.docker/config.json` in Linux kernels.
1. Add a `credHelpers` section to that file for the registry you're authenticating with:

    ```
    "credHelpers": {
        "url.of.registry.i.want.to.authenticate.with": "plaintext"
    }
    ```

    This only uses this authentication helper with that particular registry. This is important, so you don't save credentials in plaintext for everything - you only save plaintext credentials with short-lived tokens from specific repositories.

# Why?

For Windows in particular, there are currently bugs around the Windows secure credential store.
https://github.com/docker/docker-credential-helpers/issues/190

This is a temporary workaround, and perhaps a learning tool, for handling Docker credentials.