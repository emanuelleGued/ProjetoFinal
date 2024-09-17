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

A infraestrutura de subnets para a **VPC lacfas-vpc** foi projetada para garantir alta disponibilidade, segurança e escalabilidade dentro da região **us-east-1**. O objetivo é fornecer uma rede segura e resiliente que suporte diferentes tipos de recursos, como funções Lambda, banco de dados e endpoints AWS, com isolamento adequado e comunicação eficiente via **VPC Endpoints**.

### 1. VPC (Virtual Private Cloud)

A **VPC (lacfas-vpc)** foi criada com o bloco CIDR `10.0.0.0/16`, permitindo a subdivisão desse bloco em várias sub-redes para hospedar diferentes recursos e serviços. A VPC isola a infraestrutura de rede, proporcionando controle total sobre roteamento, gateways de rede e segurança.

### 2. Sub-redes Públicas

As sub-redes públicas foram criadas em múltiplas Zonas de Disponibilidade (AZs), permitindo que recursos voltados para a Internet, como funções Lambda de desenvolvimento, possam ser acessados publicamente.

- **lacfas-public-subnet-1a**: Sub-rede pública na zona **us-east-1a**, com o bloco CIDR `10.0.1.0/24`.
- **lacfas-public-subnet-1b**: Sub-rede pública na zona **us-east-1b**, com o bloco CIDR `10.0.2.0/24`.

Essas sub-redes estão associadas a um **Internet Gateway (IGW)**, permitindo acesso direto à Internet para os recursos públicos.

### 3. Sub-redes Privadas

As sub-redes privadas hospedam recursos críticos que não precisam de acesso direto à Internet. Em vez de **NAT Gateways**, a infraestrutura usa **VPC Endpoints** para permitir que as instâncias dentro dessas sub-redes façam chamadas seguras para serviços AWS, como S3, Polly, Rekognition, DynamoDB e Bedrock.

- **lacfas-database-private-subnet-1a**: Sub-rede privada para banco de dados na zona **us-east-1a**, com o bloco CIDR `10.0.3.0/24`.
- **lacfas-database-private-subnet-1b**: Sub-rede privada para banco de dados na zona **us-east-1b**, com o bloco CIDR `10.0.4.0/24`.
- **lacfas-chatbot-private-subnet-1a**: Sub-rede privada para os serviços do chatbot na zona **us-east-1a**, com o bloco CIDR `10.0.5.0/24`.
- **lacfas-chatbot-private-subnet-1b**: Sub-rede privada para os serviços do chatbot na zona **us-east-1b**, com o bloco CIDR `10.0.6.0/24`.

Essas sub-redes foram projetadas para isolar serviços sensíveis e proporcionar alta disponibilidade com resiliência.

### 4. Gateways e Roteamento

- **Internet Gateway (IGW)**: Permite que os recursos das sub-redes públicas acessem a Internet diretamente.
- **VPC Endpoints**: As sub-redes privadas utilizam **VPC Endpoints** para acessar serviços AWS (S3, DynamoDB, Polly, Rekognition e Bedrock) sem necessidade de **NAT Gateways**, o que reduz custos e melhora a segurança.
- **Tabelas de Roteamento**: O tráfego das sub-redes públicas é roteado para o IGW, enquanto as sub-redes privadas são roteadas para os VPC Endpoints.

### 5. Alta Disponibilidade e Resiliência

Com a utilização de **múltiplas Zonas de Disponibilidade (AZs)**, a infraestrutura garante que os serviços estejam sempre disponíveis, mesmo em caso de falha em uma das zonas. Os recursos críticos são replicados em duas zonas, garantindo **alta disponibilidade** e **tolerância a falhas**.

---

## Boas Práticas Implementadas na Arquitetura

A arquitetura da **VPC lacfas-vpc** segue as melhores práticas para garantir segurança, desempenho e escalabilidade:

1. **VPC Customizada**: Foi criada uma **VPC customizada** para fornecer controle total sobre a configuração da rede. O uso de uma VPC customizada permite personalização para atender a requisitos específicos de segurança e isolamento, o que é recomendado em ambientes de produção.

2. **Planejamento de CIDR**: O bloco CIDR `10.0.0.0/16` foi escolhido estrategicamente para evitar conflitos de endereçamento, proporcionando espaço para crescimento futuro e integração com outras redes através de **VPC Peering** ou **VPNs**.

3. **Sub-redes Separadas por Função**: Cada tipo de serviço (banco de dados, chatbot, desenvolvimento) possui suas próprias sub-redes dedicadas, garantindo isolamento e aplicando políticas de segurança específicas. Esse isolamento facilita o gerenciamento da rede e melhora a segurança.

4. **Alta Disponibilidade com Múltiplas Zonas de Disponibilidade**: A criação de sub-redes em múltiplas **Zonas de Disponibilidade (AZs)** garante a continuidade dos serviços em caso de falha em uma zona específica. Todos os recursos críticos são replicados em pelo menos duas AZs para garantir **alta disponibilidade**.

5. **Redução de Custos com VPC Endpoints**: Em vez de usar **NAT Gateways**, a arquitetura utiliza **VPC Endpoints** para acessar serviços AWS, como **S3**, **DynamoDB**, **Polly**, **Rekognition** e **Bedrock**, diretamente de sub-redes privadas, reduzindo custos operacionais e aumentando a segurança, pois o tráfego não precisa sair para a Internet.

Essa arquitetura foi projetada para maximizar a eficiência e segurança, minimizar custos e garantir escalabilidade para o crescimento futuro da aplicação.
