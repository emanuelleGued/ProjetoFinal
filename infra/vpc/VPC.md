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

As sub-redes privadas são usadas para hospedar recursos críticos que não precisam de acesso direto à Internet. Em vez de usar **NAT Gateways**, a infraestrutura utiliza **VPC Endpoints** para permitir que as instâncias dentro das sub-redes privadas façam chamadas de saída para serviços AWS, como S3 e DynamoDB, sem a necessidade de acesso à Internet.

- **lacfas-database-private-subnet-1a**: Sub-rede privada para banco de dados na zona **us-east-1a**, com o bloco CIDR `10.0.3.0/24`.
- **lacfas-database-private-subnet-1b**: Sub-rede privada para banco de dados na zona **us-east-1b**, com o bloco CIDR `10.0.4.0/24`.

- **lacfas-chatbot-private-subnet-1a**: Sub-rede privada para os serviços do chatbot na zona **us-east-1a**, com o bloco CIDR `10.0.5.0/24`.
- **lacfas-chatbot-private-subnet-1b**: Sub-rede privada para os serviços do chatbot na zona **us-east-1b**, com o bloco CIDR `10.0.6.0/24`.

Essas sub-redes foram projetadas para garantir o isolamento de serviços sensíveis, como bancos de dados e APIs de backend, com alta disponibilidade em múltiplas AZs.

### 4. Gateways e Roteamento

- **Internet Gateway (IGW)**: Permite que os recursos das sub-redes públicas acessem a Internet e respondam a solicitações externas.
- **VPC Endpoints**: As sub-redes privadas utilizam VPC Endpoints para permitir o tráfego direto para serviços AWS, como S3 e DynamoDB, sem a necessidade de um NAT Gateway. Isso ajuda a reduzir custos e a melhorar a segurança.
- **Tabelas de Roteamento**: As tabelas de roteamento são configuradas para direcionar o tráfego das sub-redes públicas para o IGW e das sub-redes privadas para os VPC Endpoints.

### 5. Alta Disponibilidade e Resiliência

Ao utilizar **múltiplas Zonas de Disponibilidade (AZs)**, essa infraestrutura garante que os serviços estarão sempre disponíveis, mesmo que uma zona de disponibilidade sofra interrupções. Cada serviço, tanto público quanto privado, é replicado em duas zonas de disponibilidade diferentes, garantindo **alta disponibilidade** e **tolerância a falhas**.

---

## Boas Práticas Implementadas na Arquitetura

A arquitetura da **VPC lacfas-vpc** foi cuidadosamente projetada seguindo as melhores práticas para garantir segurança, desempenho e escalabilidade:

1. **VPC Customizada**: Em vez de utilizar a **VPC Default**, uma **VPC customizada** foi criada para este projeto, proporcionando controle total sobre a estrutura da rede, como a definição de sub-redes, tabelas de roteamento e políticas de segurança. O uso de uma VPC customizada é uma prática recomendada para ambientes de produção, pois permite que as configurações sejam personalizadas de acordo com as necessidades da aplicação.

2. **Planejamento de CIDR**: Um bloco CIDR apropriado (`10.0.0.0/16`) foi escolhido para evitar sobreposição de endereços IP com outras VPCs e garantir que a arquitetura possa crescer sem problemas. Isso ajuda a evitar conflitos de endereços, especialmente ao usar **VPC Peering** ou **VPNs** para conectar outras redes à VPC.

3. **Sub-redes Separadas por Função**: Cada tipo de recurso tem sua própria sub-rede dedicada. Foram criadas sub-redes separadas para **bancos de dados**, **recursos do chatbot** e **recursos públicos**. Essa prática facilita o gerenciamento da rede, permitindo aplicar políticas de segurança específicas a cada subnet.

4. **Alta Disponibilidade com Múltiplas Zonas de Disponibilidade**: Ao criar sub-redes em pelo menos duas **Zonas de Disponibilidade (AZs)**, a arquitetura garante alta disponibilidade e resiliência contra falhas em uma zona específica. Isso permite que os serviços continuem funcionando mesmo que uma AZ sofra interrupções.

5. **Redução de Custos com VPC Endpoints**: A arquitetura usa **VPC Endpoints** para acessar serviços da AWS, como **S3** e **DynamoDB**, sem a necessidade de **NAT Gateways**. Essa abordagem reduz custos significativamente, uma vez que os NAT Gateways são cobrados pelo tráfego e pelo tempo de uso. Os **VPC Endpoints** também melhoram a segurança, já que o tráfego permanece dentro da rede privada da AWS.

Ao seguir essas práticas, a arquitetura não apenas maximiza a eficiência e a segurança, mas também minimiza custos e garante a escalabilidade necessária para o crescimento futuro.
