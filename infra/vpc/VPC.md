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

A infraestrutura de subnets para a **VPC lacfas-vpc** foi projetada para garantir alta disponibilidade, segurança e escalabilidade dentro da região **us-east-1**. O objetivo é fornecer uma rede segura e resiliente que abrigue diferentes tipos de recursos, como serviços de banco de dados, APIs de chatbot e serviços públicos, como load balancers.

### 1. VPC (Virtual Private Cloud)

A **VPC (lacfas-vpc)** foi criada com o bloco CIDR `10.0.0.0/16`, permitindo a subdivisão desse bloco em várias sub-redes para hospedar diferentes recursos e serviços. A VPC isola a infraestrutura de rede, permitindo o controle total sobre as sub-redes, tabelas de roteamento e gateways de rede, garantindo o controle e a segurança necessários para o tráfego de rede.

### 2. Sub-redes Públicas

As sub-redes públicas foram criadas em múltiplas Zonas de Disponibilidade (AZs), permitindo que os recursos voltados para a Internet, como Elastic Load Balancers (ELB), estejam acessíveis ao público. 

- **lacfas-public-subnet-1a**: Sub-rede pública na zona **us-east-1a**, com o bloco CIDR `10.0.1.0/24`.
- **lacfas-public-subnet-1b**: Sub-rede pública na zona **us-east-1b**, com o bloco CIDR `10.0.2.0/24`.

Essas sub-redes estão associadas a um **Internet Gateway (IGW)**, permitindo o acesso direto à Internet.

### 3. Sub-redes Privadas

As sub-redes privadas são usadas para hospedar recursos críticos que não precisam de acesso direto à Internet. Cada sub-rede privada é associada a um **NAT Gateway**, permitindo que as instâncias dentro dessas sub-redes façam chamadas de saída para a Internet (por exemplo, para atualizações), mas impedindo o tráfego de entrada.

- **lacfas-database-private-subnet-1a**: Sub-rede privada para banco de dados na zona **us-east-1a**, com o bloco CIDR `10.0.3.0/24`.
- **lacfas-database-private-subnet-1b**: Sub-rede privada para banco de dados na zona **us-east-1b**, com o bloco CIDR `10.0.4.0/24`.

- **lacfas-chatbot-private-subnet-1a**: Sub-rede privada para os serviços do chatbot na zona **us-east-1a**, com o bloco CIDR `10.0.5.0/24`.
- **lacfas-chatbot-private-subnet-1b**: Sub-rede privada para os serviços do chatbot na zona **us-east-1b**, com o bloco CIDR `10.0.6.0/24`.

Essas sub-redes foram projetadas para garantir o isolamento de serviços sensíveis, como bancos de dados e APIs de backend, com alta disponibilidade em múltiplas AZs.

### 4. Gateways e Roteamento

- **Internet Gateway (IGW)**: Permite que os recursos das sub-redes públicas acessem a Internet e respondam a solicitações externas.
- **NAT Gateway**: As sub-redes privadas utilizam um NAT Gateway para permitir tráfego de saída para a Internet enquanto bloqueiam o tráfego de entrada.
- **Tabelas de Roteamento**: As tabelas de roteamento são configuradas para direcionar o tráfego das sub-redes públicas para o IGW e das sub-redes privadas para o NAT Gateway.

### 5. Alta Disponibilidade e Resiliência

Ao utilizar **múltiplas Zonas de Disponibilidade (AZs)**, essa infraestrutura garante que os serviços estarão sempre disponíveis, mesmo que uma zona de disponibilidade sofra interrupções. Cada serviço, tanto público quanto privado, é replicado em duas zonas de disponibilidade diferentes, garantindo **alta disponibilidade** e **tolerância a falhas**.
