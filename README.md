# Dungeon RPG ⚔️🛡️

Bem-vindo ao **Dungeon RPG**, um jogo web completo onde você cria heróis através de atributos, defende-se de hordas em minigames e enfrenta chefes nas Batalhas de Arena por turnos! 

Desenvolvido para web e focado em reações rápidas (QTEs), gerenciamento de atributos e evolução de classes.

---

## ✨ Features Principais

* **🏰 Criação de Personagens:** Diversas classes jogáveis desde Cavaleiros, Arqueiras, até Ogros e Esqueletos. Atribua pontos em Força, Inteligência, Agilidade, Resistência e Carisma baseados na sua classe.
* **🛡️ Sistema de Equipamentos:** Melhore seus personagens no arsenal adicionando bônus passivos (Regeneração, Escudos Divinos, Golpes Críticos e Raio Arcano).
* **👾 Dungeon Defense (Minigame):** Estilo Space Invaders adaptado. Sobreviva à descida dos monstros, controle o movimento e dispare enquanto administra a velocidade inimiga progressiva a cada "onda". Totalmente funcional no Mobile.
* **⚔️ Battle Arena (Combate de Turnos em QTE):** Um combate sem piedade por turnos em que personagens atacam, defendem e usando magias baseados no pressionar no momento/tecla exata (QTEs). Erre e tome o dano total. Acerte e ganhe os combates!
* **☁️ Salve seu Progresso:** Graças à autenticação completa via Supabase, todos os XPs, os LvlUps, as Waves da Dungeon e seus inventários estão sempre salvos em nuvem para cada e-mail cadastrado.
* **📱 Responsivo para Celulares:** Jogue seja do desktop através do seu teclado ou do celular através dos direcionais e botões nativos projetados sob medida para os touch screens no meio das Batalhas.
* **🔐 Autenticação Completa:** Sistema de login seguro, registros, verificação e sistema nativo de "Recuperar Senha" interligado com a sua caixa de e-mail.

---

## 🛠️ Tecnologias Utilizadas

* **Next.js** (App Router & Server Actions)
* **React** (Hooks complexos, Mapeamentos visuais e AnimatePresence)
* **Tailwind CSS** (Tema Dark RPG customizado, vidro acetinado e pixel-art fixes)
* **Framer Motion** (Microinterações constantes)
* **Lucide React** (Ícones temáticos épicos)
* **Supabase** (PostgreSQL Database, Row Level Security Auth, e Edge Functions)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js (Versão 18+)
* NPM 
* Uma conta gratuita no [Supabase](https://supabase.com/) para rodar o banco de dados.

### Instalação Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/SantanaDZ/rpg-game.git
cd rpg-game
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as Variáveis de Ambiente**
Crie um arquivo na raiz chamado `.env.local` e rode os scripts SQL `/scripts/` presentes no repositório direto no seu **SQL Editor do Supabase**. No `.env.local`, coloque suas URL e Keys providas pelo projeto lá:
```env
NEXT_PUBLIC_SUPABASE_URL=https://zxhyzaozidqapxquxdse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aHl6YW96aWRxYXB4cXV4ZHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDM1MjAsImV4cCI6MjA4NzQ3OTUyMH0.2EHgzkyWdTxjtooadFYabUFXZ9Qk-j5iMH2TnNTyU1A

```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou npm run start se for build
```

5. **Abra o jogo no navegador!**
Acesse http://localhost:3000

---

## 🔑 Conta de Teste Recomendada

Você pode criar a sua própria conta se sua API com Supabase estiver com o Mail rodando. Se quiser usar uma conta local/teste rápida e pulando verificação: 
* **Usuário:** adm
* **Senha:** cbgames

---

*SDZ Lab*
