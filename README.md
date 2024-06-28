# Configuração

1. git clone https://github.com/pedrofaleiros/periodicos.git

2. docker ps

   - conferir os containers rodando

3. docker-compose up -d

   - subir o container caso não esteja rodando

4. criar ".env" e botar DATABASE_URL

5. npm install

6. npx prisma migrate dev

   - migração do banco de dados

7. Colocar COOKIE="" no ".env"

<br>

# Comandos

### npm run area-list X

- Pode passar ou não o X
- Lista todas as Areas ou apenas a X
- exemplo: npm run area-list 30

### npm run area-update

- Atualiza areas

### npm run per-list X

- Pode passar ou não o X
- Lista todas os Periodicos ou apenas os da area X
- Mostra os 5 primeiros e 5 últimos
- exemplo: npm run per-list 30

### npm run per-update X Y

- X obrigatorio
- Y opcional
- Atualiza Periodicos da area X até Y
- exemplo: npm run per-update 0 5

### npm run per-detail X Y

- X obrigatorio
- Y opcional
- Busca ISSN e Linguagem dos Periodicos da area X até Y
- exemplo: npm run per-detail 0 5

### npm run per-count

- Mostra a contagem dos periodicos de cada area

### npm run portal-issn X Y

- Pega os ISSN's do arquivo .csv
- Busca no portal issn do X ao Y
- X obrigatório
- Y opcional

### npm run portal-issn-list X

### npm run dados

- gera arquivo .csv com os dados dos Periodicos

### npm run servico

- rodar algo manualmente

### ctrl + C

- parar execução

### git pull

- Recarregar git

<br>

# Git

### git add .

- adicionar arquivos

### git commit -m "Commit"

- Fazer commit

### git push

- Enviar pro repositório
