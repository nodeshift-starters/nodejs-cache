## Cache Mission

![Node.js CI](https://github.com/nodeshift-starters/nodejs-cache/workflows/ci/badge.svg)

The greeting-service requires a running JDG server. In OpenShift, you
can create one with `oc apply -f service.cache.yml`.

## Running The Example

You can run this example as node processes on your localhost, as pods on a local
[OpenShift Local](https://developers.redhat.com/products/openshift-local/overview) installation.

### Localhost

To run the application on your local machine, just run the command bellow:

```
$ ./start-local.sh
```

### OpenShift Local

OpenShift Local should be started, and you should be logged in with a currently
active project. Then run the `start-openshift.sh` command.

```sh
$ crc setup # Set-up the hypervisor
$ crc start # Initialize the openshift cluster
$ oc login -u developer # Login
$ oc new-project my-example-project # Create a project to deploy to
$ ./start-openshift.sh
```

### OpenTelemetry with OpenShift Distributed Tracing Platform

Clone this repository, switch the branch to `opentelemetry-js-rhosdt`
and follow the instructions on README.md

Or visualize the instructions via github https://github.com/nodeshift-starters/nodejs-cache/tree/opentelemetry-js-rhosdt#opentelemetry-with-openshift-distributed-tracing-platform