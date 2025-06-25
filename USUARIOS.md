# 👥 Usuários do Sistema

## 🔐 Credenciais de Acesso

### 👨‍💼 Operadores
| Usuário | Senha | Tipo | Nome Completo | Permissões |
|---------|-------|------|---------------|------------|
| `daiana` | `123` | Operador 1 | Daiana Silva | Conferência de Notas |
| `gabriel` | `123` | Operador 2 | Gabriel Santos | Conferência de Notas |
| `brunna` | `123` | Operador 3 | Brunna Costa | Conferência de Notas |
| `carol` | `123` | Operador 4 | Carol Oliveira | Conferência de Notas |

### 🛠️ Suporte
| Usuário | Senha | Tipo | Nome Completo | Permissões |
|---------|-------|------|---------------|------------|
| `jeann` | `123` | Suporte Operacional | Jeann Suporte | Conferência + Suporte |

### 👑 Supervisão
| Usuário | Senha | Tipo | Nome Completo | Permissões |
|---------|-------|------|---------------|------------|
| `admin` | `master` | Supervisor | Administrador | Acesso Total |

## 🎯 Como Fazer Login

1. **Acesse a tela de login**
2. **Digite o usuário** (ex: `daiana`)
3. **Digite a senha** (ex: `123`)
4. **Clique em "Entrar"**

### 🚀 Login Rápido
Na tela de login há botões de demonstração para cada usuário - basta clicar no botão do usuário desejado que os campos serão preenchidos automaticamente.

## 🔑 Níveis de Permissão

### 📋 Operadores (1-4)
- ✅ Acesso ao Dashboard
- ✅ Módulo de Conferência de Notas
- ❌ Módulo de Suporte
- ❌ Módulo de Relatórios
- ❌ Módulo de Administração

### 🛠️ Suporte Operacional
- ✅ Acesso ao Dashboard
- ✅ Módulo de Conferência de Notas
- ✅ Módulo de Suporte
- ❌ Módulo de Relatórios
- ❌ Módulo de Administração

### 👑 Supervisor
- ✅ Acesso ao Dashboard
- ✅ Módulo de Conferência de Notas
- ✅ Módulo de Suporte
- ✅ Módulo de Relatórios
- ✅ Módulo de Administração

## 💡 Dicas

- **Usuários não são case-sensitive** (pode digitar maiúsculo ou minúsculo)
- **Senhas são case-sensitive** (deve digitar exatamente como mostrado)
- **Login é salvo no navegador** (permanece logado até fazer logout)
- **Cada usuário vê apenas os módulos permitidos** no menu lateral

## 🔄 Alteração de Usuários

Para adicionar, remover ou alterar usuários, edite o arquivo:
```
src/context/AuthContext.js
```

Procure pela constante `SYSTEM_USERS` e faça as alterações necessárias.
```

Vamos também criar um arquivo package.json se ainda não existir:

```json:package.json
{
  "name": "dashboard-operacional",
  "version": "1.0.0",
  "description": "Dashboard operacional com sistema de autenticação e módulos específicos",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "lucide-react": "^0.263.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "keywords": [
    "react",
    "dashboard",
    "operacional",
    "autenticacao",
    "conferencia-notas"
  ],
  "author": "Equipe de Desenvolvimento",
  "license": "MIT"
}
```

Para instalar as dependências e iniciar o projeto:

```bash
npm install
```

```bash
npm start