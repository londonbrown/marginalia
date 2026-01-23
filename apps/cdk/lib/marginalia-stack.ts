import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  CachedMethods,
  Distribution,
  PriceClass,
  ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket, BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, CacheControl, Source } from "aws-cdk-lib/aws-s3-deployment";
import { ARecord, AaaaRecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";
import path from "path";

export interface MarginaliaStackProps extends StackProps {
  siteDomain: string;
  zoneName: string;
}

export class MarginaliaStack extends Stack {
  constructor(scope: Construct, id: string, props: MarginaliaStackProps) {
    super(scope, id, props);

    const { siteDomain, zoneName } = props;

    const zone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: zoneName
    });

    const bucket = new Bucket(this, "SiteBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN
    });

    const certificate = new Certificate(this, "SiteCertificate", {
      domainName: siteDomain,
      validation: CertificateValidation.fromDns(zone)
    });

    const distribution = new Distribution(this, "SiteDistribution", {
      defaultRootObject: "index.html",
      domainNames: [siteDomain],
      certificate,
      priceClass: PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404/index.html",
          ttl: Duration.minutes(5)
        }
      ]
    });

    new BucketDeployment(this, "DeployWebsite", {
      destinationBucket: bucket,
      sources: [Source.asset(path.join(__dirname, "../../web/dist"))],
      distribution,
      distributionPaths: ["/*"],
      prune: true,
      cacheControl: [
        CacheControl.setPublic(),
        CacheControl.maxAge(Duration.hours(1))
      ]
    });

    new ARecord(this, "AliasRecord", {
      zone,
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
    });

    new AaaaRecord(this, "AliasRecordIpv6", {
      zone,
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
    });
  }
}
