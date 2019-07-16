## Cache Mission

[![Greenkeeper badge](https://badges.greenkeeper.io/nodeshift-starters/nodejs-cache.svg)](https://greenkeeper.io/)

The greeting-service requires a running JDG server. In OpenShift, you
can create one with `oc apply -f service.cache.yml`.

## Running The Example

You can run this example as node processes on your localhost, as pods on a local
[minishift](https://github.com/minishift/minishift/releases) installation.

### Localhost

To run the application on your local machine, just run the command bellow:

```
$ ./start-local.sh
```

### Minishift

Minishift should be started, and you should be logged in with a currently
active project. Then run the `start-openshift.sh` command.

```sh
$ minishift start # You may have some options here, e.g. --memory=8096 --vm-driver=virtualbox
$ oc login -u developer # Login
$ oc new-project my-example-project # Create a project to deploy to
$ ./start-openshift.sh
```
