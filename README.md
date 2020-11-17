# docker-credential-plaintext
A docker credential helper for plaintext storage of passwords. Use with caution.

# Installation

1. Clone the repository: `git clone https://github.com/dougrday/docker-credential-plaintext.git`
1. Add the directory you just cloned to your system's PATH environment variable.
    
    Don't forget to close and re-open your command line so the new PATH takes effect.
1. Update your Docker config, found at `%USERPROFILE%/.docker/config.json` in Windows, `~/.docker/config.json` in Linux kernels:
    * Add a `credHelpers` section at the root of the json for the repository you're authenticating with:

    ```
    "credHelpers": {
        "url.of.repository.i.want.to.authenticate.with": "plaintext"
    }
    ```

    This ensures this authentication helper is only used with that particular repository. This is important, so you don't save credentials in plaintext for everything - you only save plaintext credentials with short-lived tokens from specific repositories.
    
    * Remove `auths` data for your registries in the `.docker/config.json` file:
    
    These values may interfere with the authentication process. Remove them for the registries you added to `credHelpers`:
    ```
    "auths": {
        // Delete the following value
        "url.of.repository.i.want.to.authenticate.with": {}
    },
    ```

# Why?

For Windows in particular, there are currently bugs around the Windows secure credential store.
https://github.com/docker/docker-credential-helpers/issues/190

This is a temporary workaround, and perhaps a learning tool, for handling Docker credentials.

# A Final Warning

Plaintext credential storage could expose your credentials to an attacker if access to the machine is compromised. USE AT YOUR OWN RISK!
