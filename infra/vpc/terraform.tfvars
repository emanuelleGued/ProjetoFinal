# terraform.tfvars 

#######################   VPC    #######################
vpc_name = "lacfas-vpc"
vpc_cidr = "10.0.0.0/16"

aws_region = "us-east-1"
availability_zones = ["us-east-1a", "us-east-1b"]


# CIDRs e nomes para sub-redes privadas
private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_names = ["lacfas-private-subnet-1a", "lacfas-private-subnet-1b"]

#######################   VPC    #######################

