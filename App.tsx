import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  Menu, X, Home as HomeIcon, BookOpen, Info, Mail, 
  Search, ChefHat, Wrench, Smartphone, Palette, 
  DollarSign, Heart, ArrowRight, Clock, AlertTriangle, 
  CheckCircle, Sparkles, Loader2, Filter, HelpCircle, ExternalLink, Globe,
  Sprout, BookA // Added BookA icon
} from 'lucide-react';
import { Article, CategoryType } from './types';
import { generateTutorial } from './services/geminiService';
import { Button, Card, Badge, SectionHeader } from './components/UIComponents';

// --- DATA GENERATION UTILS ---

// Helper for contextual images based on category
const getCategoryKeywords = (cat: CategoryType): string => {
  switch(cat) {
    case CategoryType.KITCHEN: return "food,cooking,kitchen,recipe";
    case CategoryType.HOME: return "house,livingroom,cleaning,organization";
    case CategoryType.TECH: return "technology,computer,code,screen";
    case CategoryType.DIY: return "crafts,handmade,art,tools";
    case CategoryType.FINANCE: return "money,calculator,office,graph";
    case CategoryType.SELF_CARE: return "spa,yoga,relax,nature";
    case CategoryType.TOOLS: return "construction,tools,repair,workshop";
    case CategoryType.GARDENING: return "garden,plants,flowers,nature,farm";
    default: return "learning,book";
  }
};

const generateCategoryContent = (category: CategoryType, title: string) => {
  // Long form content filler to simulate >1000 words depth
  const contextText = {
    [CategoryType.KITCHEN]: `
      <h3>A Ciência e a História por trás do Sabor</h3>
      <p>Cozinhar não é apenas seguir uma receita; é entender a química dos alimentos e a cultura que os envolve. 
      Ao preparar <strong>${title}</strong>, estamos participando de uma tradição que pode remontar a séculos. 
      A gastronomia conecta pessoas, evoca memórias e desperta sentidos. Entender a reação de Maillard ao dourar uma carne, 
      ou a fermentação do glúten ao fazer um pão, transforma um cozinheiro amador em um mestre da cozinha.</p>
      <br/>
      <p>Neste guia completo, não vamos apenas listar ingredientes. Vamos mergulhar nas nuances de sabor, nas substituições inteligentes 
      e nas técnicas profissionais que elevam este prato simples a uma experiência gastronômica. Prepare-se para aprender sobre a seleção 
      rigorosa de insumos, o controle preciso de temperatura e a apresentação que encanta os olhos antes mesmo da primeira garfada.</p>
      <br/>
      <p>Além disso, é importante ressaltar o aspecto nutricional e a sustentabilidade na cozinha. Escolher ingredientes sazonais e locais 
      não só melhora o sabor do seu ${title}, mas também apoia a economia local e reduz a pegada de carbono. A cozinha moderna é consciente, 
      eficiente e, acima de tudo, apaixonante.</p>
      <br/>
      <p>Ao longo dos próximos parágrafos e instruções, detalharemos cada minúcia. Se você já se perguntou por que seus pratos anteriores 
      não ficaram como os das fotos de revista, a resposta provavelmente está nos pequenos detalhes que abordaremos a seguir: o tempo de descanso, 
      a temperatura exata do forno, ou a ordem de mistura dos ingredientes. Vamos começar essa jornada culinária?</p>
    `,
    [CategoryType.TECH]: `
      <h3>Entendendo a Tecnologia a Fundo</h3>
      <p>No mundo acelerado da tecnologia, dominar <strong>${title}</strong> é mais do que uma habilidade útil; é uma necessidade para se manter 
      relevante e seguro digitalmente. A tecnologia evolui exponencialmente, e o que era padrão ontem pode estar obsoleto hoje. Este guia não é apenas 
      um manual de instruções; é uma imersão nos conceitos fundamentais que regem este dispositivo ou software.</p>
      <br/>
      <p>Para compreender verdadeiramente este processo, precisamos olhar para "baixo do capô". Como os dados são processados? Quais são os protocolos 
      de segurança envolvidos? Ao realizar este procedimento, você está interagindo com camadas complexas de hardware e software que foram desenvolvidas 
      ao longo de décadas de engenharia. Desmistificar essa complexidade é o nosso objetivo.</p>
      <br/>
      <p>Abordaremos também as implicações de privacidade e eficiência. Muitas vezes, usuários realizam tarefas de forma automática sem entender 
      o impacto no desempenho do sistema ou na segurança de seus dados pessoais. Com as dicas avançadas que preparamos, você não apenas resolverá 
      seu problema imediato, mas também otimizará todo o seu fluxo de trabalho digital.</p>
    `,
    [CategoryType.DIY]: `
      <h3>A Arte do "Faça Você Mesmo"</h3>
      <p>O movimento Maker e a cultura DIY (Do It Yourself) resgatam a autonomia humana de criar, consertar e transformar o mundo ao nosso redor. 
      Criar <strong>${title}</strong> com suas próprias mãos oferece uma satisfação que nenhum produto comprado em loja pode proporcionar. É sobre 
      colocar sua energia, sua personalidade e seu tempo em um objeto físico.</p>
      <br/>
      <p>Historicamente, o artesanato foi a base da economia humana. Hoje, ele retorna como uma forma de terapia, sustentabilidade e expressão artística. 
      Ao trabalhar neste projeto, você desenvolverá habilidades motoras finas, paciência e resolução de problemas. Cada erro é uma lição; cada acerto, uma vitória.</p>
      <br/>
      <p>Neste dossiê completo, exploraremos não apenas o "como", mas o "porquê". Falaremos sobre a escolha dos materiais – por que usar este tipo de cola 
      e não aquele? Por que essa madeira é melhor para este acabamento? Entender as propriedades dos materiais é o que separa um projeto amador de uma peça 
      com acabamento profissional que durará anos.</p>
    `,
    [CategoryType.GARDENING]: `
      <h3>Conectando-se com a Natureza através da Jardinagem</h3>
      <p>Cultivar <strong>${title}</strong> é um ato de paciência, esperança e conexão profunda com os ciclos naturais. A jardinagem não é apenas sobre 
      fazer plantas crescerem; é sobre entender o solo, a luz, a água e a vida microscópica que sustenta tudo isso. Estudos mostram que o contato com a terra 
      reduz o estresse, melhora a saúde mental e nos ensina a respeitar o tempo das coisas.</p>
      <br/>
      <p>Neste guia detalhado, vamos além do básico de "regar e esperar". Você aprenderá sobre o pH do solo ideal, a importância da drenagem, os nutrientes 
      específicos (NPK) que esta espécie necessita e como prevenir pragas de forma ecológica. O sucesso na jardinagem está na observação e na prevenção.</p>
      <br/>
      <p>Seja em um quintal espaçoso ou em um pequeno vaso na varanda de um apartamento, é possível trazer vida para o seu ambiente. Vamos explorar as técnicas 
      de poda, o momento certo para o transplante e como simular o habitat natural da planta para que ela prospere. Prepare suas ferramentas e vamos sujar as mãos de terra!</p>
    `,
    // Fallback for others
    default: `
      <h3>Aprofundando seus Conhecimentos</h3>
      <p>Aprender sobre <strong>${title}</strong> é um passo importante para sua autonomia e desenvolvimento pessoal. 
      Muitas vezes, subestimamos a complexidade e a beleza escondida nas tarefas do dia a dia. Este guia foi elaborado 
      após extensa pesquisa e testes práticos para garantir que você tenha a melhor informação disponível em língua portuguesa.</p>
      <br/>
      <p>A metodologia que aplicamos aqui foca na eficiência e na segurança. Analisamos os erros mais comuns cometidos por iniciantes 
      e criamos barreiras de proteção neste tutorial para garantir que você tenha sucesso na primeira tentativa. O conhecimento compartilhado 
      aqui é uma síntese de boas práticas, recomendações de especialistas e feedback da nossa comunidade.</p>
      <br/>
      <p>Lembre-se: a prática leva à perfeição. Leia todo o conteúdo teórico abaixo antes de colocar a mão na massa. 
      Entender o contexto geral fará com que cada passo prático faça muito mais sentido, evitando retrabalho e frustração. 
      Vamos expandir seus horizontes?</p>
    `
  };

  const genericFaq = [
    { question: "Isso é seguro para iniciantes?", answer: "Sim! Este guia foi desenhado especificamente para quem está começando, com todos os avisos de segurança necessários." },
    { question: "Quanto tempo leva para dominar isso?", answer: "Embora o tutorial possa ser feito no tempo estimado, a maestria completa vem com a repetição e prática constante." },
    { question: "Posso substituir os materiais?", answer: "Alguns materiais são substituíveis, veja nossa seção de 'Dicas' para alternativas viáveis que não comprometem o resultado." },
    { question: "Onde encontro os itens necessários?", answer: "A maioria pode ser encontrada em lojas especializadas do ramo ou grandes varejistas online. Recomendamos sempre pesquisar preços." }
  ];

  const genericLinks = [
    { title: "Wikipédia - História do tema", url: "https://pt.wikipedia.org" },
    { title: "Canal do Youtube Recomendado", url: "https://youtube.com" },
    { title: "Fórum de Discussão Especializado", url: "https://reddit.com" }
  ];

  const t = {
    intro: `Preparar ou fazer ${title} é uma jornada fascinante. Neste guia definitivo, cobrimos absolutamente tudo o que você precisa saber.`,
    materials: ["Item Essencial 1 de alta qualidade", "Ferramenta auxiliar de precisão", "Material de consumo básico", "Equipamento de proteção individual", "Recipiente adequado"],
    steps: [
      { title: "Preparação do Ambiente e Materiais", description: "O sucesso começa antes da execução. Organize seu espaço de trabalho (mise en place), garantindo boa iluminação e ventilação. Verifique se todos os materiais estão à mão para evitar interrupções críticas durante o processo." },
      { title: "Fundamentos e Configuração Inicial", description: "Comece pelos processos básicos. Se for uma receita, misture os secos. Se for uma construção, lixe a base. Se for tecnologia, faça o backup. Esta etapa cria a fundação sólida necessária para que o resultado final seja estável e duradouro." },
      { title: "Execução da Técnica Principal", description: "Aqui acontece a mágica. Com movimentos firmes e atenção aos detalhes, aplique a técnica descrita. Observe as mudanças de textura, cor ou comportamento do sistema. Mantenha o foco total nesta etapa, pois ela define 80% da qualidade final." },
      { title: "Refinamento e Ajustes", description: "Nada sai perfeito de primeira sem ajustes. Verifique a consistência, o nível ou o funcionamento. Faça pequenas correções agora enquanto ainda é possível alterar o resultado. A paciência aqui é sua melhor ferramenta." },
      { title: "Finalização e Acabamento", description: "O toque final. Limpe as bordas, decore, ou reinicie o sistema para aplicar as mudanças. Apresente seu trabalho com orgulho. O acabamento mostra o cuidado e o carinho que você dedicou ao projeto." }
    ],
    tips: ["A qualidade dos materiais define 50% do resultado.", "Nunca pule a etapa de preparação.", "Documente seu processo com fotos para aprender depois.", "Se tiver dúvida, pare e releia as instruções."],
    errors: ["Pressa na execução das etapas iniciais.", "Uso de ferramentas inadequadas ou improvisadas.", "Ignorar as medidas de segurança recomendadas.", "Não ler o manual ou guia até o fim antes de começar."],
    conclusion: "Dominar este processo coloca você em um novo patamar de habilidade. Pratique, compartilhe seu conhecimento e continue aprendendo!",
    context: (contextText[category] || contextText.default).replace(/\$\{title\}/g, title), // Fixed replaceAll logic
    faq: genericFaq,
    references: genericLinks
  };
  
  return t;
};

// List of titles per category to generate ~140 posts
const CATEGORY_TITLES: Record<CategoryType, string[]> = {
  [CategoryType.KITCHEN]: [
    "Bolo de Cenoura com Chocolate", "Lasanha à Bolonhesa Clássica", "Risoto de Cogumelos Cremoso", 
    "Estrogonofe de Frango Simples", "Pudim de Leite Condensado", "Feijoada Completa Light", 
    "Moqueca de Peixe Baiana", "Pão de Queijo Mineiro", "Brigadeiro Gourmet de Colher", 
    "Coxinha de Frango Crocante", "Escondidinho de Carne Seca", "Tapioca Recheada de Queijo", 
    "Suco Detox Verde Refrescante", "Hambúrguer Artesanal Suculento", "Batata Frita Crocante e Sequinha", 
    "Mousse de Maracujá Rápido", "Pizza Caseira de Liquidificador", "Salada Caesar Clássica", 
    "Panqueca Americana Fofinha", "Brownie de Chocolate Molhadinho",
    // Novos 30 posts
    "Mousse de Chocolate Aerado", "Bolo de Fubá Cremoso", "Carne de Panela com Batatas", 
    "Feijão Tropeiro Tradicional", "Arroz de Forno Simples", "Salpicão de Frango", 
    "Torta de Limão Clássica", "Pavê de Chocolate Simples", "Macarrão à Carbonara", 
    "Peixe Assado no Forno", "Purê de Batata Aveludado", "Bife à Parmegiana", 
    "Sopa de Legumes Nutritiva", "Panqueca de Carne Moída", "Bolo de Milho Verde", 
    "Quiche de Lorraine", "Brigadeiro de Paçoca", "Cuscuz Paulista", "Vaca Atolada Mineira", 
    "Bobó de Camarão", "Canjica Cremosa", "Pão Caseiro Fofinho", "Molho de Tomate Caseiro", 
    "Hambúrguer de Grão de Bico", "Kibe de Forno Recheado", "Batata Gratinada", 
    "Ceviche de Tilápia", "Brownie de Caneca", "Chocolate Quente Cremoso", "Pudim de Pão Velho"
  ],
  [CategoryType.HOME]: [
    "Como Organizar o Guarda-Roupa", "Limpeza de Vidros Sem Manchas", "Horta em Apartamento Pequeno", 
    "Organização Eficiente da Despensa", "Como Limpar o Sofá em Casa", "Decoração Minimalista para Sala", 
    "Dobra Perfeita de Lençol de Elástico", "Cronograma de Limpeza Semanal", "Como Tirar Mofo da Parede", 
    "Organizando a Geladeira Corretamente", "Como Lavar Roupas Delicadas", "Manutenção Básica de Ar Condicionado", 
    "Como Escolher Tapetes para Sala", "Iluminação para Ambientes Pequenos", "Feng Shui para Iniciantes", 
    "Como Fazer Vela Aromática", "Organizando Brinquedos das Crianças", "Limpeza de Rejunte de Azulejo", 
    "Dicas para Economizar Água", "Check-list de Mudança de Casa",
    // Novos 30 posts
    "Limpar Box de Banheiro", "Organizar Armário de Potes", "Como Limpar Prata", "Tirar Mancha de Vinho", 
    "Organizar Documentos Pessoais", "Limpeza de Tapete a Seco", "Como Limpar Microondas", 
    "Organizar Gaveta de Talheres", "Limpar Tela de TV", "Tirar Cheiro de Mofo", 
    "Como Dobrar Toalhas", "Limpar Vidro de Janela", "Organizar Maquiagem", "Limpar Colchão", 
    "Como Lavar Tênis", "Organizar Cabos e Fios", "Limpar Fogão Inox", "Tirar Mancha de Café", 
    "Organizar Livros", "Limpar Ventilador", "Como Lavar Cortinas", "Organizar Sapatos", 
    "Limpar Máquina de Lavar", "Tirar Chiclete de Roupa", "Organizar Brinquedoteca", 
    "Limpar Persianas", "Como Lavar Travesseiro", "Organizar Bijuterias", 
    "Limpar Chão de Madeira", "Tirar Mancha de Caneta"
  ],
  [CategoryType.TECH]: [
    "Como Formatar o Windows 10/11", "Limpar Cache do Celular Android", "Criando uma Senha Indecifrável", 
    "Melhorar o Sinal do Wi-Fi em Casa", "Backup Automático no Google Photos", "Truques do Excel para Iniciantes", 
    "Como Editar Vídeos no Celular", "Instalando um SSD no Notebook", "Protegendo seu WhatsApp de Clonagem", 
    "Usando o ChatGPT para Estudos", "Configurar Impressora Wi-Fi", "Bloquear Spam e Email Indesejado", 
    "Atalhos de Teclado para Produtividade", "Recuperar Arquivos Deletados", "Criar um Site Grátis Rapidamente", 
    "Calibrar Bateria do Notebook", "Transferir Dados de Android para iPhone", "Como Usar o Canva para Design", 
    "Entendendo Criptomoedas (Básico)", "Como Limpar o Teclado do Notebook",
    // Novos 30 posts
    "Atalhos do Windows Que Você Não Sabia", "Melhores Extensões para Chrome", 
    "Como Criar um Email Profissional", "Dicas de Segurança no Instagram", "Como Usar o Google Drive", 
    "Converter PDF para Word", "Como Gravar a Tela do PC", "Melhorar o Desempenho do PC", 
    "Como Escolher um Notebook", "Dicas para Comprar Celular Usado", "Como Usar o Google Maps Offline", 
    "Criar Senhas Fortes", "Como Identificar Fake News", "Usar o Celular como Webcam", 
    "Como Baixar Vídeos do YouTube", "Dicas de Fotografia com Celular", "Como Configurar Roteador", 
    "Entendendo a Nuvem", "Como Recuperar Senha do Gmail", "Dicas de LinkedIn", 
    "Como Fazer um Podcast", "Usar o Trello para Organização", "Como Editar PDF Grátis", 
    "Dicas de Zoom para Reuniões", "Como Funciona o Bluetooth", "Limpar Memória do iPhone", 
    "Como Bloquear Sites no PC", "Dicas de Excel Avançado", "Como Criar um Blog"
  ],
  [CategoryType.DIY]: [
    "Como Fazer Sabonete Artesanal", "Pintura em Vasos de Cerâmica", "Macramê para Suporte de Plantas", 
    "Restaurar Móveis de Madeira Antigos", "Técnica Tie-Dye em Camisetas", "Criando Quadros Decorativos", 
    "Tricô: Pontos Básicos para Iniciar", "Origami de Tsuru Passo a Passo", "Como Fazer Slime Caseiro Seguro", 
    "Encadernação Manual Simples", "Bijuterias de Miçangas da Moda", "Pintura em Tecido para Iniciantes", 
    "Como Montar um Terrário Fechado", "Bordado Livre: Primeiros Passos", "Flores de Papel para Decoração", 
    "Customização de Jeans Velho", "Como Fazer um Scrapbook de Viagem", "Decoupage em Caixas de MDF", 
    "Amigurumi: O Círculo Mágico", "Montar Cesta de Café da Manhã",
    // Novos 30 posts
    "Vaso de Cimento Caseiro", "Porta-Treco de Garrafa PET", "Caderno Customizado", 
    "Marca Página de Papel", "Pote de Vidro Decorado", "Chaveiro de Feltro", "Bastidor Bordado", 
    "Ecobag Personalizada", "Porta-Joias de Caixa de Leite", "Móbile para Berço", 
    "Luminária de Barbante", "Tapete de Retalhos", "Almofada sem Costura", 
    "Organizador de Mesa de Papelão", "Suporte para Celular de Madeira", "Vela Perfumada em Pote", 
    "Sabonete Líquido Caseiro", "Aromatizador de Ambiente", "Enfeite de Natal Reciclado", 
    "Cesta de Jornal", "Pintura em Pedras", "Imã de Geladeira Artesanal", "Porta-Copos de Cortiça", 
    "Quadrinho de Bastidor", "Filtro dos Sonhos Simples", "Bolsa de Crochê", 
    "Cachecol de Tricô Iniciante", "Pulseira de Macramê", "Brinco de Biscuit", "Tiaras Decoradas"
  ],
  [CategoryType.FINANCE]: [
    "Criando uma Planilha de Gastos", "Saindo das Dívidas em 5 Passos", "O que é Tesouro Direto?", 
    "Economizando no Supermercado", "Calculando a Reserva de Emergência", "Cartão de Crédito: Use a Seu Favor", 
    "Declarar Imposto de Renda (Guia)", "Investindo em Fundos Imobiliários", "Negociar Dívidas com o Banco", 
    "Previdência Privada Vale a Pena?", "Ensinando Finanças para Crianças", "Reduzindo a Conta de Luz", 
    "Entendendo o Score de Crédito", "Planejamento Financeiro para Casais", "Juntar Dinheiro para Viajar", 
    "Diferença entre CDB, LCI e LCA", "Comprar Carro: Financiamento ou Consórcio?", "Regra 50-30-20 para Orçamento", 
    "Como Pedir Aumento de Salário", "Ideias de Renda Extra Rápida",
    // Novos 30 posts
    "Como Começar a Investir com Pouco", "O que é Selic e IPCA", "Como Funciona o Fundo de Garantia", 
    "Dicas para Negociar Dívidas", "Planejamento para Aposentadoria", "Como Economizar na Gasolina", 
    "O que são Dividendos", "Como Declarar Bitcoin", "Diferença entre Débito e Crédito", 
    "Como Fazer um Orçamento Familiar", "Dicas para Comprar Casa Própria", "Vale a Pena Alugar Carro?", 
    "Como Funciona o Seguro de Vida", "Economia Doméstica Prática", "Como Evitar Compras por Impulso", 
    "O que é Reserva de Oportunidade", "Como Ganhar Dinheiro na Internet", "Investir em Ações para Iniciantes", 
    "Como Funciona o Tesouro Direto", "Dicas para Freelancers", "Como Cobrar pelo seu Trabalho", 
    "Educação Financeira Infantil", "Como Sair do Vermelho", "O que é CDI", 
    "Como Escolher um Banco Digital", "Vantagens do PIX", "Como se Proteger de Golpes Financeiros", 
    "Planejamento para Casamento", "Como Juntar para a Faculdade", "Dicas de Consumo Consciente"
  ],
  [CategoryType.SELF_CARE]: [
    "Skincare Básico para Pele Oleosa", "Meditação Mindfulness para Iniciantes", "Hidratação Caseira Potente", 
    "Fazendo as Unhas em Casa (Manicure)", "Rotina Matinal para Produtividade", "Higiene do Sono: Durma Melhor", 
    "Alongamento para Quem Trabalha Sentado", "Cronograma Capilar Completo", "Automassagem para Aliviar Tensão", 
    "Escolhendo o Protetor Solar Ideal", "Estratégias para Beber Mais Água", "Esfoliante Caseiro Natural", 
    "Maquiagem Leve para o Dia a Dia", "Lidando com a Ansiedade Leve", "Benefícios da Ioga Diária", 
    "Cuidados Básicos com a Barba", "Banho Relaxante com Sais", "Diminuindo o Consumo de Açúcar", 
    "Postura Correta ao Computador", "Guia para Começar a Correr",
    // Novos 30 posts
    "Benefícios da Água com Limão", "Como Começar a Meditar", "Exercícios de Respiração", 
    "Dicas para Dormir Melhor", "Como Lidar com o Estresse", "Benefícios da Caminhada", 
    "Receitas de Sucos Detox", "Como Cuidar da Pele no Inverno", "Dicas para Cabelos Cacheados", 
    "Como Fazer Cronograma Capilar", "Benefícios do Chá Verde", "Como Parar de Roer Unhas", 
    "Dicas de Postura no Trabalho", "Alongamento Matinal", "Como Escolher um Perfume", 
    "Benefícios da Leitura", "Como Ter Mais Foco", "Dicas de Produtividade", "Como Dizer Não", 
    "Benefícios do Gratidão", "Como Organizar a Rotina", "Dicas de Alimentação Saudável", 
    "Como Fazer Jejum Intermitente", "Benefícios do Óleo de Coco", "Como Cuidar das Unhas", 
    "Dicas de Maquiagem para Noite", "Como Usar Óleos Essenciais", "Benefícios da Argila na Pele", 
    "Como Fazer Spa dos Pés", "Dicas para Relaxar a Mente"
  ],
  [CategoryType.TOOLS]: [
    "Usando a Furadeira Sem Medo", "Trocar Resistência do Chuveiro", "Kit de Ferramentas Essencial", 
    "Desentupir Pia de Cozinha Fácil", "Trocar Tomada Elétrica com Segurança", "Usando Multímetro (Básico)", 
    "Como Amolar Facas em Casa", "Reparar Furos na Parede com Massa", "Trocar o Botijão de Gás Corretamente", 
    "5 Nós de Marinheiro Úteis", "Usando Nível de Mão para Quadros", "Tirar Parafuso Espanado ou Enferrujado", 
    "Cortar Vidro: Técnica Básica", "Colar Madeira Quebrada", "Instalar Prateleira Nivelada", 
    "Trocar Fechadura de Porta", "Usando a Serra Tico-Tico", "Lubrificar Dobradiças que Rangem", 
    "Pintar Parede com Rolo Sem Manchas", "Identificar Vazamentos de Água",
    // Novos 30 posts
    "Como Usar uma Lixadeira", "Tipos de Parafusos e Buchas", "Como Trocar o Pneu do Carro", 
    "Verificar Óleo do Motor", "Como Usar uma Chave de Grifo", "Tipos de Alicates", 
    "Como Cortar Piso Cerâmico", "Como Instalar um Ventilador de Teto", "Como Limpar Ferramentas Enferrujadas", 
    "Como Organizar uma Oficina", "Como Usar uma Serra Circular", "Como Soldar Fios", 
    "Como Trocar a Resistência do Chuveiro", "Como Instalar uma Torneira", "Como Desentupir Vaso Sanitário", 
    "Como Trocar o Disjuntor", "Como Instalar uma Luminária", "Como Usar uma Trena", 
    "Como Cortar Madeira no Esquadro", "Como Pintar Metais", "Como Usar Cola de Contato", 
    "Como Fixar Objetos na Parede", "Como Usar Furadeira de Impacto", "Como Trocar a Lâmpada do Carro", 
    "Como Calibrar Pneus", "Como Verificar a Água do Radiador", "Como Trocar a Palheta do Limpador", 
    "Como Polir o Carro em Casa", "Como Tirar Riscos da Pintura", "Como Limpar o Ar Condicionado do Carro"
  ],
  [CategoryType.GARDENING]: [
    "Como Plantar Tomates em Vaso", "Cultivo de Suculentas para Iniciantes", "Horta Vertical em Apartamento", 
    "Como Fazer Compostagem Caseira", "Cuidando de Orquídeas: Guia Básico", "Plantas que Limpam o Ar da Casa", 
    "Como Podar Roseiras Corretamente", "Germinando Sementes de Limão", "Sistema de Irrigação por Gotejamento", 
    "Como Eliminar Cochonilhas Naturalmente", "Adubo Orgânico com Casca de Ovo", "Cultivando Temperos na Cozinha", 
    "Como Plantar Batata Doce em Casa", "Flores que Aguentam Sol Pleno", "Jardim de Inverno: Como Montar", 
    "Propagação de Plantas por Estaca", "Cuidando do Gramado: Corte e Rega", "Como Plantar Morangos Suspensos", 
    "Plantas Medicinais para Ter em Casa", "Terrário Aberto Passo a Passo",
    // Novos 30 posts
    "Como Cuidar de Samambaias", "Como Plantar Alface em Vaso", "Dicas para Cultivar Manjericão", 
    "Como Fazer Mudas de Plantas", "Como Eliminar Pulgões", "Como Cuidar de Cactos", 
    "Como Plantar Girassol", "Como Fazer uma Horta Suspensa", "Dicas para Regar Plantas", 
    "Como Escolher o Vaso Ideal", "Como Preparar a Terra para Plantar", "Como Podar Árvores Frutíferas", 
    "Como Plantar Cenoura em Vaso", "Dicas para Cultivar Hortelã", "Como Cuidar de Violetas", 
    "Como Plantar Pimentão", "Como Fazer Adubo Líquido", "Como Cuidar de Bonsai", 
    "Como Plantar Morango", "Dicas para Cultivar Alecrim", "Como Eliminar Formigas da Horta", 
    "Como Plantar Abobrinha", "Como Cuidar de Orquídeas no Inverno", "Como Plantar Cebolinha", 
    "Dicas para Cultivar Coentro", "Como Fazer Estufa Caseira", "Como Plantar Beterraba", 
    "Como Cuidar de Espada de São Jorge", "Como Plantar Rúcula", "Dicas para Cultivar Salsa"
  ]
};

// Main Generation Function
const generateFullMockData = (): Article[] => {
  const allArticles: Article[] = [];
  let idCounter = 100;

  (Object.keys(CATEGORY_TITLES) as CategoryType[]).forEach(category => {
    const titles = CATEGORY_TITLES[category];
    const keywords = getCategoryKeywords(category);
    
    titles.forEach((title, index) => {
      const content = generateCategoryContent(category, title);
      allArticles.push({
        id: String(idCounter++),
        title: title,
        category: category,
        // Using loremflickr with keywords for relevant images
        imageUrl: `https://loremflickr.com/800/400/${keywords}?lock=${index + idCounter}`,
        estimatedTime: `${Math.floor(Math.random() * 40) + 10} min`,
        difficulty: Math.random() > 0.7 ? 'Difícil' : Math.random() > 0.4 ? 'Médio' : 'Fácil',
        introduction: content.intro,
        context: content.context,
        materials: content.materials,
        steps: content.steps,
        tips: content.tips,
        commonErrors: content.errors,
        conclusion: content.conclusion,
        faq: content.faq,
        references: content.references,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0]
      });
    });
  });

  return allArticles;
};

// --- Initial High Quality Static Articles (Featured) ---
const FEATURED_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Como Fazer Pão Caseiro Perfeito',
    category: CategoryType.KITCHEN,
    imageUrl: 'https://loremflickr.com/800/400/bread,baking',
    estimatedTime: '3 horas',
    difficulty: 'Médio',
    introduction: 'Fazer pão em casa é uma arte terapêutica e deliciosa. Neste guia, você aprenderá a técnica básica para um pão rústico, crocante por fora e macio por dentro.',
    context: `
      <h3>A História do Pão</h3>
      <p>O pão é um dos alimentos mais antigos da humanidade, datando de mais de 10.000 anos. Símbolo de vida e sustento, ele evoluiu de massas simples cozidas em pedras quentes para as complexas fermentações naturais que vemos hoje.</p>
      <br/>
      <p>A magia acontece graças ao glúten e às leveduras. Quando misturamos farinha e água, as proteínas do trigo formam uma rede elástica (glúten). As leveduras consomem os açúcares naturais e liberam gás carbônico, que fica preso nessa rede, fazendo a massa crescer. Entender esse processo químico é a chave para o pão perfeito.</p>
      <br/>
      <p>Neste guia, não usaremos atalhos industriais. Vamos focar na fermentação lenta, que desenvolve sabores complexos e facilita a digestão. Prepare-se para perfumar sua casa inteira com o cheiro inconfundível de pão fresco.</p>
    `,
    materials: ['500g de farinha de trigo (preferência tipo 1 ou especial)', '350ml de água morna (filtrada)', '10g de fermento biológico seco instantâneo', '10g de sal refinado'],
    steps: [
      { title: 'Ativar o Fermento', description: 'Misture o fermento na água morna e deixe descansar por 5 minutos até espumar. Isso garante que as leveduras estão vivas.' },
      { title: 'Misturar Ingredientes', description: 'Em uma tigela grande, misture a farinha e o sal. Adicione a água com fermento aos poucos, mexendo com uma colher de pau até formar uma massa rústica.' },
      { title: 'Sova da Massa', description: 'Transfira para uma bancada enfarinhada. Sove vigorosamente por 10 a 15 minutos. A massa deve ficar lisa, elástica e desgrudar das mãos (ponto de véu).' },
      { title: 'Primeira Fermentação', description: 'Coloque a massa em uma tigela untada com azeite, cubra com um pano úmido e deixe descansar em local morno por 1 hora ou até dobrar de tamanho.' },
      { title: 'Modelagem e Segunda Fermentação', description: 'Retire o ar da massa suavemente, modele no formato desejado (bola ou filão) e deixe crescer por mais 40 minutos na assadeira.' },
      { title: 'Assar com Vapor', description: 'Faça cortes na superfície com uma lâmina afiada. Borrife água no forno pré-aquecido a 220°C para criar vapor (ajuda na crosta) e asse por 30-40 minutos até dourar bem.' }
    ],
    tips: ['Use farinha de boa qualidade com alto teor de proteína.', 'Não use água acima de 40°C ou matará o fermento.'],
    commonErrors: ['Cortar o pão ainda quente (o miolo fica gomoso).', 'Pouca sova (o pão fica denso e pesado).'],
    conclusion: 'Agora você tem um pão fresco, crocante e sem conservantes. Acompanha perfeitamente manteiga, azeite ou sopas.',
    faq: [
      { question: "Posso usar farinha integral?", answer: "Sim, mas o pão ficará mais denso. Recomendamos usar 50% integral e 50% branca para começar." },
      { question: "Por que meu pão não cresceu?", answer: "Provavelmente o fermento estava velho ou a água estava muito quente. Verifique a validade." }
    ],
    references: [
      { title: "História do Pão - Wikipedia", url: "https://pt.wikipedia.org/wiki/P%C3%A3o" },
      { title: "Tudo sobre Fermentação Natural", url: "https://www.google.com" }
    ],
    createdAt: '2023-10-15'
  }
];

// --- Cookie Consent Component ---
const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('saberTudo_cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('saberTudo_cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur text-slate-300 p-6 z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.2)] border-t border-slate-800 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm leading-relaxed flex-1">
          <strong className="text-white block mb-1 text-base">🍪 Respeitamos sua privacidade</strong>
          Utilizamos cookies para personalizar conteúdos e melhorar a sua experiência. Ao navegar neste site, você concorda com nossa <Link to="/privacidade" className="text-indigo-400 font-semibold hover:underline decoration-indigo-400/50">Política de Privacidade</Link> e <Link to="/termos" className="text-indigo-400 font-semibold hover:underline decoration-indigo-400/50">Termos de Uso</Link>.
        </div>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
           <Button variant="primary" onClick={handleAccept} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 border-none text-white py-2.5 px-8 text-sm font-bold rounded-full shadow-lg shadow-indigo-900/50">
             Aceitar e Continuar
           </Button>
        </div>
      </div>
    </div>
  );
};

// --- Layout Component ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToCategories = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 hover:opacity-90 transition-opacity shrink-0">
            <BookOpen className="w-8 h-8" />
            <span className="hidden sm:inline">Como Fazer</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
             {/* Search Bar Desktop */}
            <form onSubmit={handleSearch} className="relative group">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 rounded-full bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 w-40 focus:w-60 transition-all outline-none text-sm"
                />
                <Search className="absolute left-3 top-2 text-slate-400 w-4 h-4" />
            </form>

            <Link to="/" className="font-medium hover:text-indigo-600 transition-colors">Início</Link>
            <button onClick={scrollToCategories} className="font-medium hover:text-indigo-600 transition-colors bg-transparent border-none cursor-pointer">Categorias</button>
            <Link to="/sobre" className="font-medium hover:text-indigo-600 transition-colors">Sobre</Link>
            <Link to="/glossario" className="font-medium hover:text-indigo-600 transition-colors">Glossário</Link>
            <Link to="/gerar" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              <Sparkles size={16} />
              Criar com IA
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5 z-50">
             {/* Search Bar Mobile */}
             <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="O que você quer aprender?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                />
                <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
             </form>
             <Link to="/" className="py-2 font-medium border-b border-slate-100">Início</Link>
             <button onClick={scrollToCategories} className="py-2 font-medium border-b border-slate-100 text-left w-full bg-transparent">Categorias</button>
             <Link to="/sobre" className="py-2 font-medium border-b border-slate-100">Sobre</Link>
             <Link to="/glossario" className="py-2 font-medium border-b border-slate-100">Glossário</Link>
             <Link to="/contato" className="py-2 font-medium border-b border-slate-100">Contato</Link>
             <Link to="/gerar" className="py-2 font-medium text-indigo-600 font-bold bg-indigo-50 px-4 rounded-lg">Criar Tutorial com IA</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white text-xl font-bold mb-4">
              <BookOpen className="w-6 h-6" />
              <span>Como Fazer</span>
            </div>
            <p className="text-sm leading-relaxed">
              O maior portal de "Como Fazer" da internet. 
              Tutoriais detalhados, revisados e gratuitos para você aprender de tudo um pouco.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/glossario" className="hover:text-white transition-colors">Glossário A-Z</Link></li>
              <li><Link to="/gerar" className="hover:text-white transition-colors">IA Generator</Link></li>
              <li><Link to="/sobre" className="hover:text-white transition-colors">Nossa Missão</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categorias Populares</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={`/categoria/${CategoryType.KITCHEN}`} className="hover:text-white transition-colors">Cozinha</Link></li>
              <li><Link to={`/categoria/${CategoryType.TECH}`} className="hover:text-white transition-colors">Tecnologia</Link></li>
              <li><Link to={`/categoria/${CategoryType.DIY}`} className="hover:text-white transition-colors">DIY</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li className="flex items-center gap-2 mt-4"><Globe size={16}/> Brasil (PT-BR)</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          &copy; {new Date().getFullYear()} Como Fazer. Conteúdo educacional.
        </div>
      </footer>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

// --- Pages ---

// 9. Glossary Page
const GlossaryPage: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  const GLOSSARY_TERMS = [
    // A
    { t: "Air Fryer", d: "Eletrodoméstico que frita alimentos usando circulação de ar quente em alta velocidade, dispensando óleo.", c: CategoryType.KITCHEN },
    { t: "Algoritmo", d: "Sequência lógica e finita de instruções que resolvem um problema ou executam uma tarefa computacional.", c: CategoryType.TECH },
    { t: "Amigurumi", d: "Técnica japonesa de criar pequenos bonecos feitos de crochê ou tricô.", c: CategoryType.DIY },
    { t: "Adubo NPK", d: "Fertilizante contendo Nitrogênio (N), Fósforo (P) e Potássio (K), essenciais para o crescimento das plantas.", c: CategoryType.GARDENING },
    { t: "Alvenaria", d: "Construção de estruturas a partir de unidades individuais (tijolos, pedras) unidas por argamassa.", c: CategoryType.TOOLS },
    // B
    { t: "Banho-maria", d: "Técnica de cozimento indireto onde o recipiente com o alimento é colocado dentro de outro com água quente.", c: CategoryType.KITCHEN },
    { t: "Backup", d: "Cópia de segurança de dados digitais para evitar perda em caso de falha do sistema.", c: CategoryType.TECH },
    { t: "Biscuit", d: "Massa de modelar feita de amido de milho e cola branca, usada para artesanato (porcelana fria).", c: CategoryType.DIY },
    { t: "Broca", d: "Ferramenta cortante usada em furadeiras para fazer furos cilíndricos em diversos materiais.", c: CategoryType.TOOLS },
    { t: "Bitcoin", d: "Criptomoeda descentralizada, sem banco central, que pode ser enviada de usuário para usuário na rede blockchain.", c: CategoryType.FINANCE },
    // C
    { t: "Cache", d: "Área de armazenamento temporário onde o computador guarda dados acessados frequentemente para agilizar o processo.", c: CategoryType.TECH },
    { t: "Compostagem", d: "Processo biológico de reciclagem de matéria orgânica, transformando-a em adubo natural.", c: CategoryType.GARDENING },
    { t: "CDI", d: "Certificado de Depósito Interbancário. Taxa que determina o rendimento anual de diversos tipos de investimento.", c: CategoryType.FINANCE },
    { t: "Cronograma Capilar", d: "Rotina de cuidados com o cabelo que intercala hidratação, nutrição e reconstrução.", c: CategoryType.SELF_CARE },
    { t: "Cura", d: "Processo de secagem e endurecimento de materiais como concreto, cola ou tintas.", c: CategoryType.TOOLS },
    // D
    { t: "Decoupage", d: "Arte de decorar objetos colando recortes de papel e cobrindo com verniz.", c: CategoryType.DIY },
    { t: "Drenagem", d: "Sistema para escoar o excesso de água do solo ou vaso, evitando o apodrecimento das raízes.", c: CategoryType.GARDENING },
    { t: "Disjuntor", d: "Dispositivo de segurança que corta a energia elétrica automaticamente em caso de sobrecarga.", c: CategoryType.TOOLS },
    { t: "Dividendos", d: "Parte do lucro de uma empresa distribuída aos seus acionistas.", c: CategoryType.FINANCE },
    { t: "Detox", d: "Processo ou dieta destinada a eliminar toxinas do corpo.", c: CategoryType.SELF_CARE },
    // E
    { t: "Estaca", d: "Parte de uma planta (caule, folha ou raiz) usada para reprodução vegetativa.", c: CategoryType.GARDENING },
    { t: "Esfoliação", d: "Remoção de células mortas da superfície da pele.", c: CategoryType.SELF_CARE },
    { t: "Ethernet", d: "Tecnologia de conexão de redes locais (LAN) com fio.", c: CategoryType.TECH },
    { t: "Esmalte Sintético", d: "Tipo de tinta resistente usada principalmente em metais e madeiras.", c: CategoryType.TOOLS },
    { t: "Emulsificação", d: "Processo de misturar dois líquidos que normalmente não se misturam (ex: óleo e vinagre).", c: CategoryType.KITCHEN },
    // F
    { t: "Feng Shui", d: "Prática chinesa antiga de harmonização de espaços para melhorar o fluxo de energia vital (Chi).", c: CategoryType.HOME },
    { t: "Firewall", d: "Sistema de segurança de rede que monitora e controla o tráfego de entrada e saída.", c: CategoryType.TECH },
    { t: "Fermentação Natural", d: "Processo de levedar pães usando leveduras selvagens presentes no ambiente (Levain).", c: CategoryType.KITCHEN },
    { t: "Fundo de Garantia (FGTS)", d: "Depósito mensal feito pelo empregador para proteger o trabalhador demitido sem justa causa.", c: CategoryType.FINANCE },
    { t: "Feltro", d: "Tecido não tecido produzido pelo enfeltramento de fibras de lã ou sintéticas.", c: CategoryType.DIY },
    // G
    { t: "Glúten", d: "Proteína encontrada no trigo, centeio e cevada, responsável pela elasticidade da massa.", c: CategoryType.KITCHEN },
    { t: "Gesso", d: "Mineral usado em construção e acabamento, conhecido pela rápida secagem.", c: CategoryType.TOOLS },
    { t: "Grafting (Enxertia)", d: "Técnica de unir tecidos de duas plantas para que cresçam como uma só.", c: CategoryType.GARDENING },
    { t: "GPU", d: "Unidade de Processamento Gráfico. Circuito eletrônico especializado em manipular imagens.", c: CategoryType.TECH },
    // H
    { t: "Hardware", d: "Componentes físicos de um computador ou sistema eletrônico.", c: CategoryType.TECH },
    { t: "Humus", d: "Matéria orgânica decomposta no solo, rica em nutrientes.", c: CategoryType.GARDENING },
    { t: "Hidratação", d: "Reposição de água no organismo ou em partes do corpo (pele, cabelo).", c: CategoryType.SELF_CARE },
    // I
    { t: "IPCA", d: "Índice Nacional de Preços ao Consumidor Amplo. Medidor oficial da inflação no Brasil.", c: CategoryType.FINANCE },
    { t: "Interface", d: "Ponto de interação entre o usuário e o computador/software.", c: CategoryType.TECH },
    { t: "Impermeabilização", d: "Técnica para tornar uma superfície resistente à passagem de água.", c: CategoryType.TOOLS },
    // J
    { t: "Juros Compostos", d: "Juros calculados sobre o capital inicial mais os juros acumulados de períodos anteriores.", c: CategoryType.FINANCE },
    { t: "Julienne", d: "Técnica culinária de corte de vegetais em tiras finas e longas.", c: CategoryType.KITCHEN },
    // K
    { t: "Kernel", d: "Núcleo do sistema operacional, controla o hardware e software.", c: CategoryType.TECH },
    { t: "Kneading (Sova)", d: "Processo de trabalhar a massa para desenvolver o glúten.", c: CategoryType.KITCHEN },
    // L
    { t: "Lixadeira", d: "Ferramenta elétrica usada para alisar superfícies por abrasão.", c: CategoryType.TOOLS },
    { t: "Levain", d: "Fermento natural feito de farinha e água, cultivado ao longo do tempo.", c: CategoryType.KITCHEN },
    { t: "LCI/LCA", d: "Letras de Crédito Imobiliário/do Agronegócio. Investimentos isentos de imposto de renda.", c: CategoryType.FINANCE },
    // M
    { t: "Macramê", d: "Técnica de tecelagem manual que usa nós para criar padrões.", c: CategoryType.DIY },
    { t: "Malware", d: "Software malicioso projetado para danificar ou invadir computadores.", c: CategoryType.TECH },
    { t: "Mindfulness", d: "Estado mental de atenção plena no momento presente.", c: CategoryType.SELF_CARE },
    { t: "Mise en place", d: "Termo francês para organizar e separar todos os ingredientes antes de cozinhar.", c: CategoryType.KITCHEN },
    // N
    { t: "Nuvem (Cloud)", d: "Servidores acessados pela internet, e o software e bancos de dados que rodam nesses servidores.", c: CategoryType.TECH },
    { t: "NFT", d: "Token não fungível. Um ativo digital único verificado usando tecnologia blockchain.", c: CategoryType.TECH },
    // O
    { t: "Origami", d: "Arte tradicional japonesa de dobrar papel.", c: CategoryType.DIY },
    { t: "Open Source", d: "Software com código-fonte disponível para qualquer pessoa estudar, modificar ou distribuir.", c: CategoryType.TECH },
    // P
    { t: "Patchwork", d: "Trabalho com retalhos. Técnica que une tecidos diferentes.", c: CategoryType.DIY },
    { t: "pH do Solo", d: "Medida de acidez ou alcalinidade do solo, crucial para a saúde das plantas.", c: CategoryType.GARDENING },
    { t: "Phishing", d: "Técnica de fraude online para roubar dados sensíveis através de emails falsos.", c: CategoryType.TECH },
    { t: "Previdência Privada", d: "Plano de aposentadoria complementar à previdência social.", c: CategoryType.FINANCE },
    // Q
    { t: "Quinoa", d: "Grão andino rico em proteínas, considerado um superalimento.", c: CategoryType.KITCHEN },
    { t: "QR Code", d: "Código de barras bidimensional que pode ser escaneado por câmeras de celular.", c: CategoryType.TECH },
    // R
    { t: "Roteador", d: "Dispositivo que encaminha pacotes de dados entre redes de computadores.", c: CategoryType.TECH },
    { t: "Retalhos", d: "Sobras de tecido usadas em trabalhos manuais.", c: CategoryType.DIY },
    { t: "Reserva de Emergência", d: "Montante financeiro guardado para cobrir imprevistos.", c: CategoryType.FINANCE },
    { t: "Rejunte", d: "Material usado para preencher as juntas entre azulejos ou cerâmicas.", c: CategoryType.TOOLS },
    // S
    { t: "Selic", d: "Taxa básica de juros da economia brasileira.", c: CategoryType.FINANCE },
    { t: "SSD", d: "Unidade de Estado Sólido. Dispositivo de armazenamento mais rápido que o HD tradicional.", c: CategoryType.TECH },
    { t: "Suculenta", d: "Plantas que armazenam água em suas folhas ou caules, fáceis de cuidar.", c: CategoryType.GARDENING },
    { t: "Sous-vide", d: "Método de cozimento onde o alimento é selado a vácuo e cozido em temperatura controlada.", c: CategoryType.KITCHEN },
    // T
    { t: "Tesouro Direto", d: "Programa do governo brasileiro para venda de títulos públicos a pessoas físicas.", c: CategoryType.FINANCE },
    { t: "Terrário", d: "Recipiente onde se reproduzem as condições ambientais para plantas.", c: CategoryType.DIY },
    { t: "Tingimento (Tie-Dye)", d: "Técnica de tingimento de tecidos com padrões coloridos.", c: CategoryType.DIY },
    // U
    { t: "URL", d: "Endereço uniforme de recursos. O endereço de uma página na web.", c: CategoryType.TECH },
    { t: "Umidade Relativa", d: "Quantidade de vapor de água presente no ar, importante para plantas e saúde.", c: CategoryType.HOME },
    // V
    { t: "VPN", d: "Rede Privada Virtual. Ferramenta que cria uma conexão segura e criptografada.", c: CategoryType.TECH },
    { t: "Verniz", d: "Solução usada para dar acabamento protetor e brilhante a superfícies.", c: CategoryType.TOOLS },
    { t: "Vitamina C", d: "Antioxidante poderoso usado em skincare para iluminar a pele.", c: CategoryType.SELF_CARE },
    // W
    { t: "Wi-Fi", d: "Tecnologia de rede sem fio que usa ondas de rádio.", c: CategoryType.TECH },
    { t: "Widget", d: "Pequeno aplicativo ou componente de interface gráfica.", c: CategoryType.TECH },
    // X
    { t: "Xerofitismo", d: "Adaptação das plantas para sobreviver em ambientes secos.", c: CategoryType.GARDENING },
    // Y
    { t: "Yoga", d: "Prática física, mental e espiritual originária da Índia antiga.", c: CategoryType.SELF_CARE },
    // Z
    { t: "Zíper", d: "Fecho de correr usado em roupas e acessórios. Pode ser trocado ou consertado.", c: CategoryType.DIY },
    { t: "Zoom", d: "Aproximação visual em câmeras ou interfaces digitais.", c: CategoryType.TECH }
  ];

  const filteredTerms = GLOSSARY_TERMS
    .filter(item => item.t.toUpperCase().startsWith(selectedLetter))
    .sort((a, b) => a.t.localeCompare(b.t));

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <SectionHeader title="Glossário A-Z" subtitle="O dicionário completo dos termos técnicos usados no Como Fazer." />
        
        {/* Alphabet Nav */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-10">
           <div className="flex flex-wrap justify-center gap-2">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                    selectedLetter === letter 
                    ? 'bg-indigo-600 text-white shadow-md scale-110' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {letter}
                </button>
              ))}
           </div>
        </div>

        {/* Terms List */}
        {filteredTerms.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
             {filteredTerms.map((item, index) => (
               <div key={index} className="bg-white rounded-xl p-6 border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                     <h3 className="text-xl font-bold text-slate-900">{item.t}</h3>
                     <Badge color="blue">{item.c}</Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.d}</p>
                  <Link to={`/categoria/${encodeURIComponent(item.c)}`} className="text-xs text-indigo-600 hover:underline mt-3 block font-medium">
                    Ver tutoriais de {item.c} &rarr;
                  </Link>
               </div>
             ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <BookA size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Nenhum termo encontrado com a letra "{selectedLetter}"</h3>
            <p className="text-slate-500 mt-2">Estamos sempre atualizando nosso glossário. Tente outra letra.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 1. Home Page
const HomePage: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const categories = [
    { name: CategoryType.KITCHEN, icon: ChefHat, color: 'bg-orange-100 text-orange-600' },
    { name: CategoryType.HOME, icon: HomeIcon, color: 'bg-blue-100 text-blue-600' },
    { name: CategoryType.TECH, icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
    { name: CategoryType.DIY, icon: Palette, color: 'bg-pink-100 text-pink-600' },
    { name: CategoryType.GARDENING, icon: Sprout, color: 'bg-green-100 text-green-600' }, // Added Gardening here
    { name: CategoryType.FINANCE, icon: DollarSign, color: 'bg-teal-100 text-teal-600' },
    { name: CategoryType.SELF_CARE, icon: Heart, color: 'bg-red-100 text-red-600' },
    { name: CategoryType.TOOLS, icon: Wrench, color: 'bg-slate-200 text-slate-600' },
  ];

  const displayArticles = [...FEATURED_ARTICLES, ...articles.filter(a => !FEATURED_ARTICLES.find(f => f.id === a.id)).slice(0, 6)];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Badge color="blue">Mais de 140 tutoriais disponíveis</Badge>
          <h1 className="text-4xl md:text-7xl font-bold mt-6 mb-6 leading-tight tracking-tight">
            Descubra Como Fazer <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Qualquer Coisa</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
            De receitas gourmet a consertos domésticos complexos e jardinagem. Conteúdo profundo, links úteis e guias passo a passo para sua autonomia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/gerar">
              <Button variant="secondary" icon={Sparkles} className="w-full sm:w-auto text-lg px-8">Usar Assistente IA</Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white" onClick={() => document.getElementById('categorias')?.scrollIntoView({behavior: 'smooth'})}>
              Navegar Tópicos
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="O que você quer aprender hoje?" subtitle="Explore nossas categorias principais e torne-se um expert." />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((cat) => (
              <Link to={`/categoria/${encodeURIComponent(cat.name)}`} key={cat.name} className="flex flex-col items-center group cursor-pointer p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${cat.color}`}>
                  <cat.icon size={32} />
                </div>
                <span className="text-sm font-bold text-center text-slate-700 group-hover:text-indigo-600 leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20 bg-gray-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
             <div className="text-center md:text-left">
               <h2 className="text-3xl font-bold text-slate-800">Destaques da Comunidade</h2>
               <p className="text-slate-500 mt-2">Os guias mais completos e detalhados do momento.</p>
             </div>
             <Link to="/categoria/Cozinha" className="hidden md:flex items-center text-indigo-600 font-semibold hover:underline">
               Ver todos os posts <ArrowRight size={16} className="ml-1"/>
             </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {displayArticles.map((article) => (
              <Link to={`/tutorial/${article.id}`} key={article.id}>
                <Card className="h-full flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                  <div className="h-56 overflow-hidden relative">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute top-4 left-4">
                      <Badge color="purple">{article.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">
                      <span className="flex items-center gap-1"><Clock size={12}/> {article.estimatedTime}</span>
                      <span>•</span>
                      <span>{article.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{article.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                      {article.introduction}
                    </p>
                    <div className="flex items-center text-indigo-600 font-bold text-sm pt-4 border-t border-slate-100">
                      Ler Artigo Completo <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
           <div className="mt-10 text-center md:hidden">
             <Button variant="outline" className="w-full">Ver todos os posts</Button>
           </div>
        </div>
      </section>
    </div>
  );
};

// 2. Category Page
const CategoryPage: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : '';
  const categoryArticles = articles.filter(a => a.category === decodedCategory);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-indigo-600">Início</Link> 
            <ArrowRight size={12}/> 
            <span className="text-slate-800 font-medium">{decodedCategory}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{decodedCategory}</h1>
          <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
            Bem-vindo à seção de <strong>{decodedCategory}</strong>. Aqui você encontra tutoriais profundos e detalhados, 
            selecionados para garantir que você tenha todas as informações necessárias para executar suas tarefas com excelência.
            Aproveite nossos {categoryArticles.length} guias completos.
          </p>
        </div>

        {categoryArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryArticles.map((article) => (
              <Link to={`/tutorial/${article.id}`} key={article.id}>
                <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <div className="h-64 overflow-hidden rounded-t-xl relative">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white font-medium text-sm flex items-center gap-2">
                       <Badge color="blue">{article.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col bg-white rounded-b-xl">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{article.introduction}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                      <span className="flex items-center gap-1"><Clock size={12}/> {article.estimatedTime}</span>
                      <span>Atualizado em {new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="text-slate-300" size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum tutorial encontrado</h3>
             <p className="text-slate-500 mb-6">Ainda não temos conteúdo nesta categoria. Que tal gerar um?</p>
             <Link to="/gerar">
               <Button variant="primary" icon={Sparkles}>Gerar com IA</Button>
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// 2.5 Search Page (New)
const SearchPage: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const decodedQuery = decodeURIComponent(query);
  
  const results = articles.filter(a => 
    a.title.toLowerCase().includes(decodedQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(decodedQuery.toLowerCase()) ||
    a.introduction.toLowerCase().includes(decodedQuery.toLowerCase())
  );

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <SectionHeader title={`Resultados para "${decodedQuery}"`} subtitle={`${results.length} tutoriais encontrados`} />
        </div>
        
        {results.length > 0 ? (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {results.map(article => (
               <Link to={`/tutorial/${article.id}`} key={article.id}>
                 <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                    <div className="h-64 overflow-hidden rounded-t-xl relative">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
                    <div className="absolute bottom-4 left-4 text-white font-medium text-sm flex items-center gap-2">
                       <Badge color="blue">{article.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col bg-white rounded-b-xl">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{article.introduction}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                      <span className="flex items-center gap-1"><Clock size={12}/> {article.estimatedTime}</span>
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold">{article.category}</span>
                    </div>
                  </div>
                 </Card>
               </Link>
             ))}
           </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Nenhum resultado encontrado</h3>
            <p className="text-slate-500 mt-2">Tente termos diferentes ou navegue pelas categorias.</p>
            <Link to="/">
              <Button variant="primary" className="mt-6">Voltar ao Início</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Article View Page
const ArticlePage: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const found = articles.find(a => a.id === id);
    if (found) {
      setArticle(found);
    } else {
      navigate('/');
    }
  }, [id, articles, navigate]);

  if (!article) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>;

  return (
    <div className="py-12 bg-slate-50/50">
      <article className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
           <Link to={`/categoria/${encodeURIComponent(article.category)}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-4 transition-colors font-medium">
             <ArrowRight className="rotate-180" size={16}/> Voltar para {article.category}
           </Link>
        </div>

        {/* Hero Article */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 mb-10">
          <div className="h-80 md:h-96 w-full relative">
             <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
             <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
               <div className="flex flex-wrap gap-3 mb-4">
                  <Badge color="purple">{article.category}</Badge>
                  {article.isGenerated && <Badge color="green">IA Generated</Badge>}
               </div>
               <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-black drop-shadow-lg">{article.title}</h1>
               <div className="flex items-center gap-6 text-slate-200 text-sm font-medium">
                  <span className="flex items-center gap-2"><Clock size={18}/> {article.estimatedTime}</span>
                  <span className="flex items-center gap-2"><ChefHat size={18}/> Dificuldade: {article.difficulty}</span>
               </div>
             </div>
          </div>
          
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Introdução</h2>
            <p className="text-lg text-slate-600 leading-8 mb-8 font-serif">
              {article.introduction}
            </p>

            {/* Deep Context Section */}
            {article.context && (
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 mb-10 prose prose-indigo max-w-none text-slate-700">
                <div dangerouslySetInnerHTML={{ __html: article.context }} />
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content: Steps */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Steps */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                 <div className="bg-indigo-600 text-white p-2 rounded-lg"><CheckCircle size={24}/></div>
                 Passo a Passo Detalhado
              </h2>
              <div className="space-y-10">
                {article.steps.map((step, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center">
                       <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-200">
                         {index + 1}
                       </div>
                       {index !== article.steps.length - 1 && <div className="w-0.5 flex-grow bg-slate-200 mt-4 h-full min-h-[50px]"></div>}
                    </div>
                    <div className="pb-8">
                       <h3 className="text-2xl font-bold text-slate-800 mb-3">{step.title}</h3>
                       <p className="text-slate-600 leading-8 text-lg">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Errors */}
            <div className="grid md:grid-cols-2 gap-6">
               <Card className="p-6 bg-indigo-50 border-indigo-100 h-full">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                    <Sparkles size={20} className="text-indigo-600"/> Dicas de Mestre
                  </h3>
                  <ul className="space-y-4">
                    {article.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed">
                        <span className="text-indigo-500 font-bold">•</span> {tip}
                      </li>
                    ))}
                  </ul>
               </Card>

               {article.commonErrors && article.commonErrors.length > 0 && (
                <Card className="p-6 bg-red-50 border-red-100 h-full">
                   <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2 text-lg">
                     <AlertTriangle size={20} className="text-red-600"/> Erros Comuns
                   </h3>
                   <ul className="space-y-4">
                     {article.commonErrors.map((err, idx) => (
                       <li key={idx} className="flex gap-3 text-red-800 leading-relaxed">
                          <X size={18} className="shrink-0 mt-1"/> {err}
                       </li>
                     ))}
                   </ul>
                </Card>
               )}
            </div>

            {/* Conclusion */}
            <div className="bg-slate-900 text-white rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>
               <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Conclusão</h3>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">{article.conclusion}</p>
               </div>
            </div>

            {/* FAQ Section */}
            {article.faq && article.faq.length > 0 && (
              <div className="pt-10 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <HelpCircle className="text-indigo-600"/> Perguntas Frequentes
                </h2>
                <div className="space-y-4">
                  {article.faq.map((item, idx) => (
                    <details key={idx} className="group bg-white rounded-xl border border-slate-200 open:shadow-md transition-all">
                      <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-slate-800 marker:content-none hover:bg-slate-50 rounded-xl transition-colors">
                        {item.question}
                        <ArrowRight className="h-5 w-5 transition-transform group-open:rotate-90 text-slate-400" />
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             {/* Materials Widget */}
             {article.materials && article.materials.length > 0 && (
               <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 shadow-sm lg:sticky lg:top-24">
                 <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-xl pb-4 border-b border-yellow-200/50">
                   <Wrench size={22} className="text-yellow-700"/> O que você precisa
                 </h3>
                 <ul className="space-y-4">
                   {article.materials.map((item, idx) => (
                     <li key={idx} className="flex items-start gap-3 text-slate-800 font-medium leading-snug">
                       <div className="w-5 h-5 rounded-full bg-white border border-yellow-400 flex items-center justify-center shrink-0 mt-0.5">
                         <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                       </div>
                       <span className="flex-1">{item}</span>
                     </li>
                   ))}
                 </ul>
                 <div className="mt-8 pt-4 border-t border-yellow-200 text-xs text-center text-yellow-800">
                    Certifique-se de ter tudo antes de começar.
                 </div>
               </div>
             )}

             {/* External Links Widget */}
             {article.references && article.references.length > 0 && (
               <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Globe size={20} className="text-blue-500"/> Saiba Mais
                 </h3>
                 <ul className="space-y-3">
                   {article.references.map((link, idx) => (
                     <li key={idx}>
                       <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors group">
                         <span className="text-sm font-medium">{link.title}</span>
                         <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                       </a>
                     </li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
        </div>
      </article>
    </div>
  );
};

// 4. Generator Page
const GeneratorPage: React.FC<{ onGenerate: (article: Article) => void }> = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    const article = await generateTutorial(topic);
    setLoading(false);

    if (article) {
      onGenerate(article);
      navigate(`/tutorial/${article.id}`);
    } else {
      alert("Ocorreu um erro ao gerar o tutorial. Tente novamente.");
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8 inline-flex p-6 bg-white rounded-3xl shadow-xl shadow-indigo-100/50">
          <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">O que você quer <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">aprender agora?</span></h1>
        <p className="text-slate-600 mb-12 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Nossa Inteligência Artificial cria guias <strong>completos e profissionais</strong> exclusivamente para você. 
          Digite qualquer coisa: de "trocar pneu" a "história da arte".
        </p>

        <form onSubmit={handleGenerate} className="relative max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm">
              <Search className="absolute left-6 text-slate-400 w-6 h-6" />
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Como plantar tomates orgânicos..." 
                className="w-full pl-16 pr-4 py-6 text-lg rounded-2xl border-0 focus:ring-0 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>
          
          <div className="mt-8">
            <Button type="submit" disabled={loading || !topic} className="w-full md:w-auto mx-auto text-lg px-12 py-4 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 bg-indigo-600 hover:bg-indigo-700">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Escrevendo artigo completo...
                </>
              ) : (
                'Gerar Guia Profissional'
              )}
            </Button>
          </div>
        </form>

        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-6">Sugestões Populares</p>
          <div className="flex flex-wrap justify-center gap-3">
             {["🔧 Consertar Torneira", "🍳 Risoto de Camarão", "💻 Criar um Site", "🎨 Pintar Aquarela", "🧘‍♀️ Meditação Guiada"].map(s => (
               <button 
                 key={s} 
                 onClick={() => setTopic(s.replace(/^[^\s]+\s/, ''))}
                 className="bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all font-medium text-sm"
               >
                 {s}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. About Page & 6. Contact Page (Simplified for brevity, same as before but styled)
const AboutPage: React.FC = () => (
  <div className="py-20 bg-white">
    <div className="container mx-auto px-4 max-w-3xl text-center">
      <SectionHeader title="Sobre o Como Fazer" />
      <div className="prose prose-lg mx-auto text-slate-600 text-left font-serif leading-8">
        <p className="mb-6 first-letter:text-6xl first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
          O <strong>Como Fazer</strong> nasceu de uma ideia simples: o conhecimento prático não deveria ser difícil de encontrar.
          Em um mundo cheio de informações dispersas, nossa missão é centralizar, organizar e simplificar o aprendizado para todos.
        </p>
        <p>
          Acreditamos que qualquer pessoa é capaz de aprender qualquer coisa, desde que tenha as instruções certas.
          Seja para consertar algo em casa, cozinhar um jantar especial ou aprender uma nova habilidade técnica, nós temos o guia certo para você.
        </p>
      </div>
    </div>
  </div>
);

const ContactPage: React.FC = () => (
  <div className="py-20 bg-gray-50">
    <div className="container mx-auto px-4 max-w-4xl">
      <SectionHeader title="Fale Conosco" subtitle="Dúvidas? Parcerias? Estamos aqui." />
      <div className="bg-white rounded-2xl p-10 shadow-lg border border-slate-100 text-center">
        <p className="text-slate-600 mb-6">Envie um email diretamente para nossa equipe.</p>
        <a href="mailto:contato@comofazer.com" className="text-2xl font-bold text-indigo-600 hover:underline">contato@comofazer.com</a>
      </div>
    </div>
  </div>
);

// 7. Privacy Policy & 8. Terms of Use
const PrivacyPage: React.FC = () => (
  <div className="py-20 bg-white">
    <div className="container mx-auto px-4 max-w-4xl">
      <SectionHeader title="Política de Privacidade" />
      <div className="prose prose-indigo max-w-none text-slate-600">
        <p className="mb-4">Sua privacidade é importante para nós. É política do Como Fazer respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="/" className="text-indigo-600 underline">Como Fazer</a>, e outros sites que possuímos e operamos.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Coleta de Informações</h3>
        <p className="mb-4">Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Uso de Dados</h3>
        <p className="mb-4">Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Compartilhamento</h3>
        <p className="mb-4">Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Compromisso do Usuário</h3>
        <p className="mb-4">O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Como Fazer oferece no site e com caráter enunciativo, mas não limitativo:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
          <li>Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
          <li>Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Como Fazer, de seus fornecedores ou terceiros.</li>
        </ul>
        
        <p className="text-sm text-slate-400 mt-8">Esta política é efetiva a partir de Março/2024.</p>
      </div>
    </div>
  </div>
);

const TermsPage: React.FC = () => (
  <div className="py-20 bg-gray-50">
    <div className="container mx-auto px-4 max-w-4xl">
      <SectionHeader title="Termos de Uso" />
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-slate-600">
        <h3 className="text-xl font-bold text-slate-800 mb-3">1. Termos</h3>
        <p className="mb-6">Ao acessar ao site Como Fazer, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3">2. Uso de Licença</h3>
        <p className="mb-4">É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Como Fazer , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>modificar ou copiar os materiais;</li>
          <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
          <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Como Fazer;</li>
          <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
        </ul>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3">3. Isenção de responsabilidade</h3>
        <p className="mb-6">Os materiais no site da Como Fazer são fornecidos 'como estão'. Como Fazer não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3">4. Precisão dos materiais</h3>
        <p className="mb-6">Os materiais exibidos no site da Como Fazer podem incluir erros técnicos, tipográficos ou fotográficos. Como Fazer não garante que qualquer material em seu site seja preciso, completo ou atual. Como Fazer pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio.</p>

        <h3 className="text-xl font-bold text-slate-800 mb-3">5. Links</h3>
        <p className="mb-6">O Como Fazer não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Como Fazer do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>
      </div>
    </div>
  </div>
);

// --- Main App Component ---
const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const generatedData = generateFullMockData();
    setArticles([...FEATURED_ARTICLES, ...generatedData]);
  }, []);

  const handleNewArticle = (article: Article) => {
    setArticles(prev => [article, ...prev]);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage articles={articles} />} />
          <Route path="/categoria/:category" element={<CategoryPage articles={articles} />} />
          <Route path="/tutorial/:id" element={<ArticlePage articles={articles} />} />
          <Route path="/gerar" element={<GeneratorPage onGenerate={handleNewArticle} />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/busca" element={<SearchPage articles={articles} />} />
          <Route path="/glossario" element={<GlossaryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;