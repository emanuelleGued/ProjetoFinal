# Provedor AWS
provider "aws" {
  region = var.aws_region
}

# Criação da VPC
resource "aws_vpc" "lacfas_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = var.vpc_name
  }
}

# Criação do Internet Gateway
resource "aws_internet_gateway" "lacfas_igw" {
  vpc_id = aws_vpc.lacfas_vpc.id
  tags = {
    Name = "lacfas-igw"
  }
}

# Tabela de Roteamento Pública
resource "aws_route_table" "lacfas_public_route_table" {
  vpc_id = aws_vpc.lacfas_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.lacfas_igw.id
  }

  tags = {
    Name = "lacfas-public-route-table"
  }
}

# Tabela de Roteamento Privada 
resource "aws_route_table" "lacfas_private_route_table" {
  vpc_id = aws_vpc.lacfas_vpc.id

  tags = {
    Name = "lacfas-private-route-table"
  }
}

# Sub-redes Públicas em múltiplas AZs
resource "aws_subnet" "lacfas_public_subnet" {
  count = length(var.availability_zones)

  vpc_id                  = aws_vpc.lacfas_vpc.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = var.public_subnet_names[count.index]
  }
}

# Sub-redes Privadas de Banco de Dados em múltiplas AZs
resource "aws_subnet" "lacfas_database_subnet" {
  count = length(var.availability_zones)

  vpc_id            = aws_vpc.lacfas_vpc.id
  cidr_block        = var.database_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = var.database_subnet_names[count.index]
  }
}

# Sub-redes Privadas de Chatbot em múltiplas AZs
resource "aws_subnet" "lacfas_chatbot_subnet" {
  count = length(var.availability_zones)

  vpc_id            = aws_vpc.lacfas_vpc.id
  cidr_block        = var.chatbot_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = var.chatbot_subnet_names[count.index]
  }
}

# Associação da Tabela de Roteamento Pública à Sub-rede Pública
resource "aws_route_table_association" "lacfas_public_route_assoc" {
  count = length(var.availability_zones)

  subnet_id      = aws_subnet.lacfas_public_subnet[count.index].id
  route_table_id = aws_route_table.lacfas_public_route_table.id
}

# Associação da Tabela de Roteamento Privada à Sub-rede de Banco de Dados
resource "aws_route_table_association" "lacfas_database_route_assoc" {
  count = length(var.availability_zones)

  subnet_id      = aws_subnet.lacfas_database_subnet[count.index].id
  route_table_id = aws_route_table.lacfas_private_route_table.id
}

# Associação da Tabela de Roteamento Privada à Sub-rede de Chatbot
resource "aws_route_table_association" "lacfas_chatbot_route_assoc" {
  count = length(var.availability_zones)

  subnet_id      = aws_subnet.lacfas_chatbot_subnet[count.index].id
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

# Security Group para Lambda de Desenvolvimento (Pública)
resource "aws_security_group" "dev_lacfas_lambda_sg" {
  vpc_id = aws_vpc.lacfas_vpc.id
  name   = "dev-lacfas-lambda-sg"

  # Regras de Egress (saída) - permitir saída para a Internet
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Permitir saída para qualquer destino (Internet) na porta 443 (HTTPS)
  }

  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Permitir saída para a Internet na porta 80 (HTTP)
  }

  # Boa prática: não definir regras de Ingress (entrada), já que a Lambda é invocada de dentro da AWS
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = []
    description = "Nenhum tráfego de entrada é permitido, Lambda invocada internamente pela AWS"
  }

  tags = {
    Name = "dev-lacfas-lambda-sg"
  }
}

# Security Group para Lambda de Produção (Privada)
resource "aws_security_group" "prod_lacfas_lambda_sg" {
  vpc_id = aws_vpc.lacfas_vpc.id
  name   = "prod-lacfas-lambda-sg"

  # Regras de Egress (saída) - permitir saída para os VPC Endpoints (porta 443 para HTTPS)
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Permitir saída para a Internet (caso de exceção)
    description = "Tráfego HTTPS para VPC Endpoints"
  }

  # Boa prática: não definir regras de Ingress (entrada), já que a Lambda é invocada de dentro da AWS
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = []
    description = "Nenhum tráfego de entrada é permitido, Lambda invocada internamente pela AWS"
  }

  tags = {
    Name = "prod-lacfas-lambda-sg"
  }
}
