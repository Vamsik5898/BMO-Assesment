output "vpc_id" {
  value = aws_vpc.main.id
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.test_cluster.name
}

output "rds_cluster_endpoint" {
  value = aws_rds_cluster.aurora.endpoint
}