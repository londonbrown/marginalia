#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { MarginaliaStack } from "../lib/marginalia-stack";

const app = new App();

const siteDomain = app.node.tryGetContext("siteDomain");
const zoneName = app.node.tryGetContext("zoneName");

if (!siteDomain || !zoneName) {
  throw new Error(
    "Missing context. Provide siteDomain and zoneName via cdk.json or --context."
  );
}

new MarginaliaStack(app, "MarginaliaStack", {
  siteDomain,
  zoneName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
