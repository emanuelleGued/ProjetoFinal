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

# VPC Endpoint para Polly
resource "aws_vpc_endpoint" "polly" {
  vpc_id       = aws_vpc.lacfas_vpc.id
  service_name = "com.amazonaws.${var.aws_region}.polly"
  vpc_endpoint_type = "Interface"   # Polly requer um endpoint de interface
  subnet_ids   = aws_subnet.lacfas_chatbot_subnet[*].id  # Subnets privadas
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
  subnet_ids   = aws_subnet.lacfas_chatbot_subnet[*].id  # Subnets privadas
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
  subnet_ids   = aws_subnet.lacfas_chatbot_subnet[*].id  # Subnets privadas
  security_group_ids = [aws_security_group.prod_lacfas_lambda_sg.id]

  tags = {
    Name = "lacfas-bedrock-endpoint"
  }
}



#######################   VPC    #######################

#######################   SEC GROUPS    #######################

resource "aws_security_group" "prod_lacfas_lambda_sg" {
  vpc_id =aws_vpc.lacfas_vpc.id
  name   = var.prod_lambda_sg_name  

  # Egress (Saída) - Permitir tráfego de saída para os VPC Endpoints (HTTPS)
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Permitir saída para qualquer destino (HTTPS)
    description = "Allow HTTPS traffic to VPC Endpoints"
  }

  # Ingress (Entrada) - Nenhuma regra de entrada definida
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = []
    description = "No ingress traffic allowed"
  }

  tags = {
    Name = var.prod_lambda_sg_name  
  }
}

resource "aws_security_group" "dev_lacfas_lambda_sg" {
  vpc_id =aws_vpc.lacfas_vpc.id
  name   = var.dev_lambda_sg_name  #

  # Egress (Saída) - Permitir tráfego de saída para a Internet (HTTPS)
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Permitir saída para qualquer destino (Internet) na porta 443 (HTTPS)
    description = "Allow HTTPS traffic to the Internet"
  }

  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Permitir saída para a Internet na porta 80 (HTTP)
    description = "Allow HTTP traffic to the Internet"
  }

  # Ingress (Entrada) - Nenhuma regra de entrada definida
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = []
    description = "No ingress traffic allowed"
  }

  tags = {
    Name = var.dev_lambda_sg_name 
  }
}

#######################   BOT LAMBDAS    #######################

resource "aws_lambda_function" "dev_lambda" {
  function_name = var.lambda_dev_name 
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "index.handler"   
  runtime       = "nodejs18.x"     

  vpc_config {
    subnet_ids         = [aws_subnet.lacfas_public_subnet[0].id]  
    security_group_ids = [aws_security_group.dev_lacfas_lambda_sg.id]  
  }

  # Fonte do código no S3
  s3_bucket = "lacfas-bucket"             # Nome do bucket S3
  s3_key    = "index.zip"                 # Caminho do arquivo ZIP no bucket

  tags = {
    Name = var.lambda_dev_name
  }
}

resource "aws_lambda_function" "prod_lambda" {
  function_name = var.lambda_prod_name  
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "index.handler"   
  runtime       = "nodejs18.x"     

 
  vpc_config {
    subnet_ids         = [aws_subnet.lacfas_chatbot_subnet[0].id] 
    security_group_ids = [aws_security_group.prod_lacfas_lambda_sg.id]  
  }

  # Fonte do código no S3
  s3_bucket = "lacfas-bucket"             # Nome do bucket S3
  s3_key    = "index.zip"                 # Caminho do arquivo ZIP no bucket

  tags = {
    Name = var.lambda_prod_name
  }
}


#######################  NACL ####################### 

# NACL para a Subnet Pública
resource "aws_network_acl" "public_nacl" {
  vpc_id = aws_vpc.lacfas_vpc.id
  tags = {
    Name = "lacfas-public-nacl"
  }
}

# Regras de Entrada (Ingress) para NACL Pública - Permitir HTTP e HTTPS
resource "aws_network_acl_rule" "public_nacl_ingress_http_https" {
  network_acl_id = aws_network_acl.public_nacl.id
  rule_number    = 100
  protocol       = "tcp"
  from_port      = 80
  to_port        = 443
  cidr_block     = "0.0.0.0/0"
  egress         = false
  rule_action    = "allow"
}

# Regras de Saída (Egress) para NACL Pública - Permitir todo o tráfego de saída
resource "aws_network_acl_rule" "public_nacl_egress" {
  network_acl_id = aws_network_acl.public_nacl.id
  rule_number    = 100
  protocol       = "tcp"
  from_port      = 0
  to_port        = 0
  cidr_block     = "0.0.0.0/0"
  egress         = true
  rule_action    = "allow"
}

# Associação de NACL à Subnet Pública
resource "aws_network_acl_association" "public_nacl_assoc" {
  network_acl_id = aws_network_acl.public_nacl.id
  subnet_id      = aws_subnet.lacfas_public_subnet[0].id
}

# NACL para a Subnet Privada
resource "aws_network_acl" "private_nacl" {
  vpc_id = aws_vpc.lacfas_vpc.id
  tags = {
    Name = "lacfas-private-nacl"
  }
}

# Regras de Entrada (Ingress) para NACL Privada - Permitir tráfego de serviços AWS (HTTPS)
resource "aws_network_acl_rule" "private_nacl_ingress_https" {
  network_acl_id = aws_network_acl.private_nacl.id
  rule_number    = 100
  protocol       = "tcp"
  from_port      = 443
  to_port        = 443
  cidr_block     = "0.0.0.0/0"
  egress         = false
  rule_action    = "allow"
}

# Regras de Saída (Egress) para NACL Privada - Permitir todo o tráfego de saída
resource "aws_network_acl_rule" "private_nacl_egress" {
  network_acl_id = aws_network_acl.private_nacl.id
  rule_number    = 100
  protocol       = "tcp"
  from_port      = 0
  to_port        = 0
  cidr_block     = "0.0.0.0/0"
  egress         = true
  rule_action    = "allow"
}

# Associação de NACL à Subnet Privada
resource "aws_network_acl_association" "private_nacl_assoc" {
  network_acl_id = aws_network_acl.private_nacl.id
  subnet_id      = aws_subnet.lacfas_chatbot_subnet[0].id
}




#######################  BOTS LAMBDA IAM ROLE ####################### 
resource "aws_iam_role" "lambda_execution_role" {
  name = "lacfas-lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "lacfas-lambda-execution-role"
  }
}

# Policy para permitir acesso aos serviços S3, DynamoDB, Polly, Bedrock, Rekognition
resource "aws_iam_policy" "lambda_execution_policy" {
  name = "lacfas-lambda-execution-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Permissão para acessar S3 (lacfas-bucket)
      {
        Action = [
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:s3:::lacfas-bucket",              # Nome do bucket
          "arn:aws:s3:::lacfas-bucket/*"
        ]
      },
      
      # Permissão para acessar DynamoDB
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect = "Allow"
        Resource = "arn:aws:dynamodb:${var.aws_region}:*:table/your-table-name"  # Nome da tabela
      },
      
      # Permissão para acessar Polly
      {
        Action = [
          "polly:SynthesizeSpeech"
        ]
        Effect = "Allow"
        Resource = "*"
      },
      
      # Permissão para acessar Bedrock
      {
        Action = [
          "bedrock:InvokeModel"
        ]
        Effect = "Allow"
        Resource = "*"
      },
      
      # Permissão para acessar Rekognition
      {
        Action = [
          "rekognition:DetectLabels",
          "rekognition:CompareFaces",
          "rekognition:DetectFaces"
        ]
        Effect = "Allow"
        Resource = "*"
      }
    ]
  })
  
  tags = {
    Name = "lacfas-lambda-execution-policy"
  }
}

# Attach the policy to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_execution_policy.arn
}
