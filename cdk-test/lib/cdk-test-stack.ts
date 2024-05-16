import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as rds from '@aws-cdk/aws-rds';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

export class cdk-test-stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'publicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'privateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        }
      ]
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: vpc
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      memoryLimitMiB: 512,
      cpu: 256,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc: vpc,
      internetFacing: true
    });

    const listener = lb.addListener('Listener', {
      port: 80,
    });


    const ecsService = new ecs.FargateService(this, 'Service', {
      cluster: cluster,
      taskDefinition: taskDefinition,
      desiredCount: 1,
      loadBalancers: [{
        containerName: 'DefaultContainer',
        containerPort: 80,
        listenerArn: listener.listenerArn,
      }],
    });

    const rdsCluster = new rds.DatabaseCluster(this, 'MyRdsCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_2_08_1,
      }),
      instanceProps: {
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Allow ECS tasks to access the RDS cluster
    rdsCluster.connections.allowFrom(ecsService, ec2.Port.tcp(3306));
  }
}
