# variables.tf

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

# CIDRs para sub-redes privadas 
variable "private_subnet_cidrs" {
  description = "CIDR blocks para sub-redes privadas"
  type        = list(string)
}

# Nomes para sub-redes privadas 
variable "private_subnet_names" {
  description = "Nomes para sub-redes privadas"
  type        = list(string)
}

variable "allowed_ip_range" {
  description = "Range de IPs permitidos para acesso"
  type        = string
  default     = "0.0.0.0/0" # Permite acesso de qualquer IP (ajuste conforme necessário)
}

variable "security_group_name" {
  description = "Nome do Security Group"
  type        = string
  default     = "lacfas-lambda-sg"
}