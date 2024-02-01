# Trigger Travis Build

## 🚀 Description

This application was created to automate Docker image builds for **CODA** repos by triggering the **Travis CI** build jobs.

## ⚡ Requirements

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

## 🛠️ Install

### Linux and MacOS

```
git clone https://github.com/denesbeck/ttbcli.git ~/.config/ttbcli && npm i -g ~/.config/ttbcli && ttbcli
```

## 🗑️ Uninstall

### Linux and MacOS

```
ttbcli re && npm uninstall -g ttbcli && rm -rf ~/.config/ttbcli
```

To resolve EACCESS permission errors please refer to [this](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) npm documentation.

## 📦 Setup

### 💾 Configs

**Travis** job configs can be found in the `configs` folder. To add more job configs, fork this repository, add your own config files and open a pull request.

### 💾 Commands

| Command               | Description                      | Alias |
| --------------------- | -------------------------------- | ----- |
| `ttbcli run`          | Trigger the Travis build         | r     |
| `ttbcli set-token`    | Set the Travis API token         | st    |
| `ttbcli get-token`    | Get the Travis API token         | gt    |
| `ttbcli remove-token` | Remove the Travis API token      | rt    |
| `ttbcli debug-on`     | Turn on debug mode               | do    |
| `ttbcli debug-off`    | Turn off debug mode              | df    |
| `ttbcli debug`        | Get debug mode status            | d     |
| `ttbcli reset`        | Remove all environment variables | re    |

### 💾 `.yaml` file structure

#### top-level

| Property         | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| **version**      | 2 or 3 (default is 2, if omitted)                          |
| **context**      | `prod` or `nonprod` or `pu` or `sonar`                     |
| **repositories** | an array of objects representing the targeted repositories |

#### repositories

| Property | Value                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------- |
| name     | name of the repo, to be retrieved from **Travis CI** or from **GitHub**.                                 |
| owner    | owner of the repo, to be retrieved from **Travis CI** or from **GitHub**.                                |
| run      | this boolean indicates whether a build should be triggered for this repo                                 |
| branch   | you can specify the branch name on which the build should be triggered (ignored when context eq. 'prod') |

### 💾 Template

```yaml
---
version: 3
context: prod
repositories:
  - name: demo-app-1
    owner: demo-org
    run: true
    branch: main
  - name: demo-app-2
    owner: demo-org
    run: true
    branch: main
  - name: demo-app-3
    owner: demo-org
    run: true
    branch: main
```

### 📁 Travis Docs

[Triggering builds with API V3](https://docs.travis-ci.com/user/triggering-builds/)
