// See https://docs.docker.com/engine/reference/commandline/login/
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { exit } = require("process");
const sha1 = crypto.createHash("sha1");

// ["node", "docker-credential-plaintext.js", "get"]
// ["node", "docker-credential-plaintext.js", "store"]
// ["node", "docker-credential-plaintext.js", "erase"]
// ["node", "docker-credential-plaintext.js", "list"]
if (process.argv.length < 3) {
    process.stderr.write("Docker credential 'action' was not provided.\n");
    exit(1);
}

const payload = fs.readFileSync(process.stdin.fd, "utf-8");
const action = process.argv[2];
const basedir = path.join(
    require("os").homedir(),
    ".docker-credential-plaintext"
);

function getFilePath(serverUrl) {
    sha1.update(serverUrl);
    const filename = sha1.digest("hex");
    return path.join(basedir, filename);
}

function storeCredentials(jsonText) {
    process.stderr.write(`
====================================================================
 WARNING! This credential helper stores credentials as plaintext!

 Do not use with long-lived access tokens or passwords!
 This helper should only be considered when using short-lived
 tokens (e.g. SSO). In all cases, use with caution!
====================================================================

`);

    try {
        const json = JSON.parse(jsonText);
        const serverUrl = json.ServerURL;
        // ServerURL shouldn't be stored
        delete json.ServerURL;        

        if (!fs.existsSync(basedir)) {
            fs.mkdirSync(basedir);
        }

        const filePath = getFilePath(serverUrl);
        fs.writeFileSync(filePath, JSON.stringify(json), { encoding: "utf-8" });
    }
    catch (err) {
        process.stdout.write(err);
    }
}

function getCredentials(serverUrl) {
    const filePath = getFilePath(serverUrl);
    if (fs.existsSync(filePath)) {
        const jsonText = fs.readFileSync(filePath, { encoding: "utf-8" });
        process.stdout.write(jsonText + "\n");
    }
}

function eraseCredentials(serverUrl) {
    try {
        const filePath = getFilePath(serverUrl);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File ${filePath} not found!`);
        }
        fs.unlinkSync(filePath);
    }
    catch (err) {
        process.stdout.write(err);
    }
}

switch (action) {
    case "store":
        storeCredentials(payload);
        break;
    case "get":
        getCredentials(payload);
        break;
    case "erase":
        eraseCredentials(payload);
        break;
    // FIXME: might need "list" here as well?
}
