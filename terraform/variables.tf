variable "aws_region" {
  type        = string
  description = "AWS region to deploy infrastructure"
  default     = "ap-south-1"
}

variable "cluster_name" {
  type        = string
  description = "EKS cluster name"
  default     = "taskboard-eks"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
  default     = "dev"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.20.0.0/16"
}
