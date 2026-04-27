# TaskFlow — To-Do List com Boa Experiência de UI/UX

## 📌 Descrição

O **TaskFlow** é uma aplicação web simples de lista de tarefas (To-Do List) desenvolvida com foco em **boas práticas de UI/UX**.
O projeto demonstra como uma interface limpa, consistente e com feedback adequado melhora significativamente a experiência do usuário.

Este projeto foi criado para fins acadêmicos, servindo como contraponto a uma versão com má experiência de usuário.

---

## 🎯 Objetivos

* Demonstrar boas práticas de UI/UX
* Implementar uma interface intuitiva e funcional
* Aplicar conceitos de feedback visual e interação
* Utilizar persistência de dados no navegador
* Estruturar código frontend de forma clara e escalável

---

## 🧠 Conceitos de UI/UX aplicados

* **Hierarquia visual clara** (título → input → lista)
* **Feedback imediato** (ações refletidas instantaneamente)
* **Consistência visual** (cores, espaçamento, botões)
* **Baixa carga cognitiva** (interface simples e direta)
* **Controle do usuário** (adicionar, concluir e remover tarefas)
* **Estados da interface** (lista vazia, tarefas pendentes)
* **Acessibilidade básica** (foco em inputs e interações claras)

---

## ⚙️ Funcionalidades

* Adicionar tarefas
* Remover tarefas
* Marcar tarefas como concluídas
* Filtrar tarefas:

  * Todas
  * Ativas
  * Concluídas
* Contador de tarefas pendentes
* Persistência com `localStorage`
* Atualização automática da interface (renderização reativa)

---

## 🗂️ Estrutura do projeto

```
taskflow/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🚀 Como executar o projeto

### 1. Clonar ou baixar o projeto

```bash
git clone <url-do-repositorio>
cd taskflow
```

Ou apenas baixe e extraia os arquivos.

---

### 2. Executar no navegador

Opção simples:

* Abra o arquivo `index.html` diretamente no navegador

Opção recomendada (VS Code):

1. Instale a extensão **Live Server**
2. Clique com botão direito em `index.html`
3. Selecione **"Open with Live Server"**

---

## 💾 Persistência de dados

O projeto utiliza o **localStorage** do navegador para salvar as tarefas.

* As tarefas permanecem mesmo após recarregar a página
* Estrutura dos dados:

```json
{
  "id": 1710000000000,
  "text": "Exemplo de tarefa",
  "completed": false
}
```

---

## 🔄 Fluxo da aplicação

1. Usuário digita uma tarefa
2. A tarefa é adicionada ao estado (`tasks[]`)
3. O estado é salvo no `localStorage`
4. A interface é re-renderizada automaticamente
5. Interações (concluir/remover) atualizam o estado e a UI

---

## 🧩 Possíveis melhorias futuras

* Edição de tarefas
* Drag and drop (reordenação)
* Animações de transição
* Dark mode
* Integração com backend (API)
* Componentização (React/Vue)

---

## 📚 Contexto acadêmico

Este projeto foi desenvolvido como exemplo de **boa experiência de UI/UX**, podendo ser comparado com uma versão propositalmente mal projetada para análise crítica.

---

## 👨‍💻 Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla)

---

## 📄 Licença

Este projeto é de uso acadêmico e livre para estudo.
