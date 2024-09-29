# main.tf

# Provedor AWS
provider "aws" {
  region = var.aws_region
}

#######################   VPC    #######################

# Criação da VPC
resource "aws_vpc" "lacfas_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = var.vpc_name
  }
}

# Tabela de Roteamento Privada 
resource "aws_route_table" "lacfas_private_route_table" {
  vpc_id = aws_vpc.lacfas_vpc.id

  tags = {
    Name = "lacfas-private-route-table"
  }
}

# Sub-redes Privadas em múltiplas AZs
resource "aws_subnet" "lacfas_private_subnet" {
  count = length(var.availability_zones)

  vpc_id            = aws_vpc.lacfas_vpc.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = var.private_subnet_names[count.index]
  }
}

# Associação da Tabela de Roteamento Privada à Sub-rede 
resource "aws_route_table_association" "lacfas_route_assoc" {
  count = length(var.availability_zones)

  subnet_id      = aws_subnet.lacfas_private_subnet[count.index].id
  route_table_id = aws_route_table.lacfas_private_route_table.id
}

# VPC Endpoint para S3
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.lacfas_vpc.id
  service_name = "com.amazonaws.${var.aws_region}.s3"
  route_table_ids = [aws_route_table.lacfas_private_route_table.id]

  tags = {
    Name = "lacfas-s3-endpoint"
  }
}

# VPC Endpoint para DynamoDB
resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id       = aws_vpc.lacfas_vpc.id
  service_name = "com.amazonaws.${var.aws_region}.dynamodb"
  route_table_ids = [aws_route_table.lacfas_private_route_table.id]

  tags = {
    Name = "lacfas-dynamodb-endpoint"
  }
}

# VPC Endpoint para Polly
resource "aws_vpc_endpoint" "polly" {
  vpc_id       = aws_vpc.lacfas_vpc.id
  service_name = "com.amazonaws.${var.aws_region}.polly"
  vpc_endpoint_type = "Interface"   # Polly requer um endpoint de interface
  subnet_ids   = aws_subnet.lacfas_private_subnet[*].id  # Subnets privadas
  security_group_ids = [aws_security_group.prod_lacfas_lambda_sg.id]

  tags = {
    Name = "lacfas-polly-endpoint"
  }
}

# VPC Endpoint para Rekognition
resource "aws_vpc_endpoint" "rekognition" {
  vpc_id       = aws_vpc.lacfas_vpc.id
  service_name = "com.amazonaws.${var.aws_region}.rekognition"
  vpc_endpoint_type = "Interface"   # Rekognition requer um endpoint de interface
  subnet_ids   = aws_subnet.lacfas_private_subnet[*].id  # Subnets privadas
  security_group_ids = [aws_security_group.prod_lacfas_lambda_sg.id]

  tags = {
    Name = "lacfas-rekognition-endpoint"
  }
}

# VPC Endpoint para Bedrock
resource "aws_vpc_endpoint" "bedrock" {
  vpc_id       = aws_vpc.lacfas_vpc.id
  service_name = "com.amazonaws.${var.aws_region}.bedrock"
  vpc_endpoint_type = "Interface"   # Bedrock requer um endpoint de interface
  subnet_ids   = aws_subnet.lacfas_private_subnet[*].id  # Subnets privadas
  security_group_ids = [aws_security_group.prod_lacfas_lambda_sg.id]

  tags = {
    Name = "lacfas-bedrock-endpoint"
  }
}

# Security Group para a Lambda e Endpoints VPC
resource "aws_security_group" "prod_lacfas_lambda_sg" {
  vpc_id = aws_vpc.lacfas_vpc.id

  name        = var.security_group_name
  description = "Security Group para Lambdas e VPC Endpoints"

  # Permitir tráfego de entrada na porta 443 (HTTPS) para os Endpoints de Interface (Polly, Rekognition, Bedrock)
  ingress {
    description = "Allow HTTPS traffic for Interface Endpoints"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip_range]
  }

  # Permitir todo o tráfego de saída
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.allowed_ip_range]
  }

  # Tags
  tags = {
    Name = var.security_group_name
  }
}
