## Tabela de Endereçamento - lacfas-vpc

| **Subnet Name**                    | **Subnet IP Block** | **Availability Zone** |
|------------------------------------|---------------------|-----------------------|
| lacfas-private-subnet-1a           | 10.0.1.0/24         | us-east-1a            |
| lacfas-private-subnet-1b           | 10.0.2.0/24         | us-east-1b            |

## Descrição da Infraestrutura

A infraestrutura da **VPC lacfas-vpc** foi projetada para ser completamente privada e segura, dentro da região **us-east-1**, sem exposição direta à internet. Todos os serviços da AWS necessários são acessados por **VPC Endpoints** para garantir a segurança e eficiência do tráfego de rede, sem depender de **NAT Gateways** ou sub-redes públicas.

### 1. VPC (Virtual Private Cloud)

A **VPC (lacfas-vpc)** foi criada com o bloco CIDR `10.0.0.0/16` e subdividida em sub-redes privadas distribuídas em múltiplas **Zonas de Disponibilidade (AZs)**. Todos os recursos residem em sub-redes privadas, utilizando **VPC Endpoints** para interagir com serviços da AWS, garantindo que não haja tráfego de internet externo.

### 2. Sub-redes Privadas

As sub-redes privadas hospedam recursos como funções Lambda e outros serviços que não requerem acesso direto à internet. Todas as interações externas com a AWS acontecem via **VPC Endpoints**.

- **lacfas-private-subnet-1a**: Sub-rede privada na zona **us-east-1a**, CIDR `10.0.1.0/24`.
- **lacfas-private-subnet-1b**: Sub-rede privada na zona **us-east-1b**, CIDR `10.0.2.0/24`.

Essas sub-redes são isoladas da internet, permitindo uma comunicação segura e controlada com os serviços da AWS, através de **VPC Endpoints**.

### 3. VPC Endpoints

Os **VPC Endpoints** permitem que recursos dentro das sub-redes privadas se comuniquem com os serviços da AWS sem a necessidade de rotear o tráfego pela internet pública.

