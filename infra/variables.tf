#######################   VPC    #######################


# Variável para o nome da VPC
variable "vpc_name" {
  description = "Nome da VPC"
  type        = string
}

# Variável para o CIDR da VPC
variable "vpc_cidr" {
  description = "Bloco CIDR da VPC"
  type        = string
}

# Região AWS
variable "aws_region" {
  description = "Região AWS"
  type        = string
}

# Lista de Zonas de Disponibilidade
variable "availability_zones" {
  description = "Lista de Zonas de Disponibilidade"
  type        = list(string)
}

# CIDRs para sub-redes públicas
variable "public_subnet_cidrs" {
  description = "CIDR blocks para sub-redes públicas"
  type        = list(string)
}

# Nomes para sub-redes públicas
variable "public_subnet_names" {
  description = "Nomes para sub-redes públicas"
  type        = list(string)
}

# CIDRs para sub-redes privadas de Banco de Dados
variable "database_subnet_cidrs" {
  description = "CIDR blocks para sub-redes privadas (Banco de Dados)"
  type        = list(string)
}

# Nomes para sub-redes privadas de Banco de Dados
variable "database_subnet_names" {
  description = "Nomes para sub-redes privadas de Banco de Dados"
  type        = list(string)
}

# CIDRs para sub-redes privadas de Chatbot
variable "chatbot_subnet_cidrs" {
  description = "CIDR blocks para sub-redes privadas (Chatbot)"
  type        = list(string)
}

# Nomes para sub-redes privadas de Chatbot
variable "chatbot_subnet_names" {
  description = "Nomes para sub-redes privadas de Chatbot"
  type        = list(string)
}

#######################   VPC    #######################

#######################   LAMBDA FUNCTIONS    #######################

# Nome da Lambda de Desenvolvimento
variable "lambda_dev_name" {
  description = "Nome da Lambda de Desenvolvimento"
  type        = string
  default     = "dev-lacfas-bot-function"
}

# Nome da Lambda de Produção
variable "lambda_prod_name" {
  description = "Nome da Lambda de Produção"
  type        = string
  default     = "prod-lacfas-bot-function"
}

# Nome do Security Group para Lambda de Desenvolvimento
variable "dev_lambda_sg_name" {
  description = "Nome do Security Group da Lambda de Desenvolvimento"
  type        = string
  default     = "dev-lacfas-lambda-sg"
}

# Nome do Security Group para Lambda de Produção
variable "prod_lambda_sg_name" {
  description = "Nome do Security Group da Lambda de Produção"
  type        = string
  default     = "prod-lacfas-lambda-sg"
}


#######################   LAMBDA FUNCTIONS    #######################
