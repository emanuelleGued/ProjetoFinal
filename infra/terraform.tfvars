#######################   VPC    #######################
vpc_name = "lacfas-vpc"
vpc_cidr = "10.0.0.0/16"

aws_region = "us-east-1"
availability_zones = ["us-east-1a", "us-east-1b"]
# CIDRs e nomes para sub-redes públicas
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
public_subnet_names = ["lacfas-public-subnet-1a", "lacfas-public-subnet-1b"]

# CIDRs e nomes para sub-redes privadas de Banco de Dados
database_subnet_cidrs = ["10.0.3.0/24", "10.0.4.0/24"]
database_subnet_names = ["lacfas-database-private-subnet-1a", "lacfas-database-private-subnet-1b"]

# CIDRs e nomes para sub-redes privadas de Chatbot
chatbot_subnet_cidrs = ["10.0.5.0/24", "10.0.6.0/24"]
chatbot_subnet_names = ["lacfas-chatbot-private-subnet-1a", "lacfas-chatbot-private-subnet-1b"]

#######################   VPC    #######################
