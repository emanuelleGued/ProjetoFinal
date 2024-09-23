## Tabela de Endereçamento - lacfas-vpc

| **Subnet Name**                    | **Subnet IP Block** | **Availability Zone** |
|------------------------------------|---------------------|-----------------------|
| lacfas-public-subnet-1a            | 10.0.1.0/24         | us-east-1a            |
| lacfas-public-subnet-1b            | 10.0.2.0/24         | us-east-1b            |
| lacfas-database-private-subnet-1a  | 10.0.3.0/24         | us-east-1a            |
| lacfas-database-private-subnet-1b  | 10.0.4.0/24         | us-east-1b            |
| lacfas-chatbot-private-subnet-1a   | 10.0.5.0/24         | us-east-1a            |
| lacfas-chatbot-private-subnet-1b   | 10.0.6.0/24         | us-east-1b            |

## Descrição da Infraestrutura

A infraestrutura da **VPC lacfas-vpc** foi projetada para oferecer uma rede segura, resiliente e escalável dentro da região **us-east-1**, atendendo aos requisitos de isolamento de recursos e alta disponibilidade. Ela permite comunicação eficiente entre serviços AWS via **VPC Endpoints**, protegendo o tráfego com **Security Groups** e **NACLs**.

### 1. VPC (Virtual Private Cloud)

A **VPC (lacfas-vpc)** foi criada com o bloco CIDR `10.0.0.0/16` e é subdividida em várias sub-redes, públicas e privadas, para hospedar recursos como funções Lambda, serviços do chatbot e banco de dados, garantindo controle total sobre o roteamento e segurança.

### 2. Sub-redes Públicas

As sub-redes públicas são usadas para hospedar recursos que precisam de acesso direto à Internet, como as funções Lambda de desenvolvimento.

- **lacfas-public-subnet-1a**: Sub-rede pública na zona **us-east-1a**, CIDR `10.0.1.0/24`.
- **lacfas-public-subnet-1b**: Sub-rede pública na zona **us-east-1b**, CIDR `10.0.2.0/24`.

Essas sub-redes estão conectadas a um **Internet Gateway (IGW)** para permitir o acesso à Internet.

### 3. Sub-redes Privadas

As sub-redes privadas hospedam recursos críticos que não precisam de acesso direto à Internet, utilizando **VPC Endpoints** para acessar serviços AWS como S3, Polly, Rekognition, DynamoDB e Bedrock, sem a necessidade de um NAT Gateway.

- **lacfas-database-private-subnet-1a**: Sub-rede privada para banco de dados na zona **us-east-1a**, CIDR `10.0.3.0/24`.
- **lacfas-database-private-subnet-1b**: Sub-rede privada para banco de dados na zona **us-east-1b**, CIDR `10.0.4.0/24`.
- **lacfas-chatbot-private-subnet-1a**: Sub-rede privada para o chatbot na zona **us-east-1a**, CIDR `10.0.5.0/24`.
- **lacfas-chatbot-private-subnet-1b**: Sub-rede privada para o chatbot na zona **us-east-1b**, CIDR `10.0.6.0/24`.

### 4. Gateways e Roteamento

- **Internet Gateway (IGW)**: Permite que os recursos nas sub-redes públicas acessem a Internet.
- **VPC Endpoints**: São usados nas sub-redes privadas para acessar serviços AWS como S3, DynamoDB, Polly, Rekognition e Bedrock, sem precisar de NAT Gateways, o que reduz custos e melhora a segurança.
- **Tabelas de Roteamento**: As tabelas de roteamento são configuradas para que o tráfego das sub-redes públicas passe pelo IGW, e o tráfego das sub-redes privadas use os **VPC Endpoints**.

### 5. Security Groups (Grupos de Segurança)

- **dev-lacfas-lambda-sg**: Permite que a função Lambda de desenvolvimento acesse a Internet via HTTP (porta 80) e HTTPS (porta 443), garantindo segurança nas comunicações.
- **prod-lacfas-lambda-sg**: Permite que a função Lambda de produção acesse serviços AWS (via HTTPS) através dos VPC Endpoints, sem acesso direto à Internet, garantindo que o tráfego permaneça dentro da rede privada da AWS.

### 6. NACLs (Listas de Controle de Acesso de Rede)

- **NACL Pública**: Controla o tráfego das sub-redes públicas, permitindo o tráfego de entrada HTTP (porta 80) e HTTPS (porta 443) e permitindo todo o tráfego de saída.
- **NACL Privada**: Controla o tráfego das sub-redes privadas, permitindo tráfego de entrada apenas para serviços AWS (via HTTPS) e permitindo todo o tráfego de saída.

### 7. Alta Disponibilidade e Resiliência

Recursos críticos são replicados em **múltiplas Zonas de Disponibilidade (AZs)** para garantir alta disponibilidade. Caso uma AZ falhe, os serviços continuam operando em outra zona.

### 8. IAM Roles e Políticas

- **lacfas-lambda-execution-role**: Atribuída às funções Lambda, permite o acesso necessário para interagir com serviços AWS como **S3**, **DynamoDB**, **Polly**, **Rekognition** e **Bedrock**.
  
  A política anexada garante permissões específicas para cada serviço, como leitura/escrita no bucket S3 (lacfas-bucket) e acesso às tabelas do DynamoDB.

---

## Boas Práticas Implementadas na Arquitetura

A arquitetura da **VPC lacfas-vpc** segue as melhores práticas de AWS:

1. **VPC Customizada**: Criar uma VPC personalizada permite controle total sobre o design de rede, isolamento e segurança.
2. **Planejamento de CIDR**: O bloco CIDR `10.0.0.0/16` foi planejado para evitar sobreposição de endereços e permitir expansões futuras.
3. **Isolamento de Sub-redes**: Sub-redes separadas por função (desenvolvimento, banco de dados, chatbot) garantem isolamento adequado e aplicabilidade de políticas de segurança específicas.
4. **Alta Disponibilidade com Múltiplas AZs**: A replicação em várias Zonas de Disponibilidade assegura alta disponibilidade e resiliência contra falhas em uma única zona.
5. **Redução de Custos com VPC Endpoints**: O uso de VPC Endpoints substitui NAT Gateways, economizando custos e garantindo que o tráfego permaneça seguro dentro da rede da AWS.

Esta infraestrutura foi projetada para maximizar segurança, desempenho e escalabilidade, minimizando custos e garantindo crescimento futuro.
