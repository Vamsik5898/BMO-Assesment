variable "aws_region" {
  description = "The AWS region to deploy to."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr_a" {
  description = "The CIDR block for the public subnet in availability zone A."
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_cidr_b" {
  description = "The CIDR block for the public subnet in availability zone B."
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_cidr_a" {
  description = "The CIDR block for the private subnet in availability zone A."
  type        = string
  default     = "10.0.3.0/24"
}

variable "private_subnet_cidr_b" {
  description = "The CIDR block for the private subnet in availability zone B."
  type        = string
  default     = "10.0.4.0/24"
}

variable "rds_master_username" {
  description = "The master username for the RDS cluster."
  type        = string
  default     = "admin"
}

variable "rds_master_password" {
  description = "The master password for the RDS cluster."
  type        = string
  sensitive   = true
  default = "test12345678"
}
