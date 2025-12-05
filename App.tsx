import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  Menu, X, Home as HomeIcon, BookOpen, Info, Mail, 
  Search, ChefHat, Wrench, Smartphone, Palette, 
  DollarSign, Heart, ArrowRight, Clock, AlertTriangle, 
  CheckCircle, Sparkles, Loader2, Filter, HelpCircle, ExternalLink, Globe,
  Sprout, BookA, MapPin, Send
} from 'lucide-react';
import { Article, CategoryType } from './types';
import { generateTutorial } from './services/geminiService';
import { Button, Card, Badge, SectionHeader, Input } from './components/UIComponents';

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

// --- PAGE COMPONENTS ---

const HomePage: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const navigate = useNavigate();
  const categories = Object.values(CategoryType);
  const recentArticles = articles.slice(0, 9);

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-indigo-600 text-white py-20 px-4 mb-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Aprenda a fazer qualquer coisa.</h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Tutoriais passo a passo para descomplicar sua vida.
          </p>
          <div className="max-w-2xl mx-auto relative group">
             <button onClick={() => document.getElementById('categorias')?.scrollIntoView({behavior:'smooth'})} className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg">
               Explorar Categorias
             </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="container mx-auto px-4 mb-20">
        <SectionHeader title="Navegue por Categorias" subtitle="Encontre exatamente o que você precisa" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link to={`/categoria/${cat}`} key={cat} className="group p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all text-center flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {cat === CategoryType.KITCHEN ? <ChefHat /> : 
                   cat === CategoryType.TECH ? <Smartphone /> :
                   cat === CategoryType.HOME ? <HomeIcon /> :
                   cat === CategoryType.DIY ? <Palette /> :
                   cat === CategoryType.FINANCE ? <DollarSign /> :
                   cat === CategoryType.GARDENING ? <Sprout /> :
                   cat === CategoryType.TOOLS ? <Wrench /> : <Heart />}
               </div>
               <span className="font-semibold text-slate-700">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="container mx-auto px-4">
        <SectionHeader title="Adicionados Recentemente" subtitle="Novos guias para você aprender hoje" />
        <div className="grid md:grid-cols-3 gap-8">
          {recentArticles.map(article => (
            <Link to={`/tutorial/${article.id}`} key={article.id} className="group">
              <Card className="h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <Badge color="blue">{article.category}</Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{article.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 mt-auto">
                    <span className="flex items-center gap-1"><Clock size={14} /> {article.estimatedTime}</span>
                    <span className="flex items-center gap-1"><CheckCircle size={14} /> {article.difficulty}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
            <Link to="/busca?q=" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                Ver todos os tutoriais <ArrowRight size={18} />
            </Link>
        </div>
      </section>
    </div>
  );
};

const CategoryPage: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const { category } = useParams<{ category: string }>();
  const filtered = articles.filter(a => a.category === category);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <Link to="/" className="text-slate-400 hover:text-indigo-600 text-sm mb-4 inline-block">&larr; Voltar para Home</Link>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          {category} <span className="text-slate-400 text-lg font-normal">({filtered.length} tutoriais)</span>
        </h1>
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
           {filtered.map(article => (
            <Link to={`/tutorial/${article.id}`} key={article.id} className="group">
              <Card className="h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4">{article.introduction.substring(0, 100)}...</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto">
                    <span className="flex items-center gap-1"><Clock size={14} /> {article.estimatedTime}</span>
                    <span className="flex items-center gap-1"><CheckCircle size={14} /> {article.difficulty}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
           <p className="text-slate-500 text-lg">Nenhum tutorial encontrado nesta categoria ainda.</p>
           <Link to="/gerar" className="text-indigo-600 font-bold mt-2 inline-block hover:underline">Seja o primeiro a criar um!</Link>
        </div>
      )}
    </div>
  );
};

const ArticlePage: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);

  if (!article) return <div className="text-center py-20">Artigo não encontrado.</div>;

  return (
    <div className="bg-white pb-20">
        {/* Article Header */}
        <div className="bg-slate-900 text-white py-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex items-center gap-3 text-indigo-300 text-sm font-semibold uppercase tracking-wider mb-4">
                    <Link to={`/categoria/${article.category}`} className="hover:text-white transition-colors">{article.category}</Link>
                    <span>&bull;</span>
                    <span>{article.createdAt}</span>
                    {article.isGenerated && (
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-xs border border-indigo-500/30">IA Generated</span>
                    )}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">{article.title}</h1>
                <div className="flex flex-wrap gap-6 text-slate-300">
                    <div className="flex items-center gap-2">
                        <Clock className="text-indigo-400" /> 
                        <span className="font-medium">{article.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-indigo-400" /> 
                        <span className="font-medium">Dificuldade: {article.difficulty}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 -mt-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-xl mb-12 border border-slate-100">
                <img src={article.imageUrl} alt={article.title} className="w-full h-64 md:h-96 object-cover" />
            </div>

            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1">
                    <div className="prose prose-lg max-w-none text-slate-600 mb-12">
                        <p className="lead text-xl text-slate-800 font-medium italic border-l-4 border-indigo-500 pl-4 bg-slate-50 py-4 pr-4 rounded-r-lg">
                            {article.introduction}
                        </p>
                        <div className="mt-8" dangerouslySetInnerHTML={{ __html: article.context }} />
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Wrench className="text-indigo-600" /> Materiais Necessários
                        </h2>
                        <ul className="grid sm:grid-cols-2 gap-3">
                            {article.materials?.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                            <BookOpen className="text-indigo-600" /> Passo a Passo
                        </h2>
                        <div className="space-y-8">
                            {article.steps.map((step, i) => (
                                <div key={i} className="flex gap-4 md:gap-6">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shrink-0">
                                            {i + 1}
                                        </div>
                                        {i !== article.steps.length - 1 && <div className="w-0.5 bg-indigo-100 h-full my-2"></div>}
                                    </div>
                                    <div className="pb-8">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                            <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                <Sparkles size={18} /> Dicas de Mestre
                            </h3>
                            <ul className="space-y-3">
                                {article.tips.map((tip, i) => (
                                    <li key={i} className="text-green-700 text-sm flex gap-2">
                                        <span className="font-bold">•</span> {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                <AlertTriangle size={18} /> Erros Comuns
                            </h3>
                            <ul className="space-y-3">
                                {article.commonErrors.map((error, i) => (
                                    <li key={i} className="text-red-700 text-sm flex gap-2">
                                        <span className="font-bold">•</span> {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100 text-center mb-12">
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">Conclusão</h3>
                        <p className="text-indigo-800">{article.conclusion}</p>
                    </div>

                    {/* FAQ */}
                    <div className="mb-12">
                         <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <HelpCircle className="text-indigo-600" /> Perguntas Frequentes
                        </h2>
                        <div className="space-y-4">
                            {article.faq.map((item, i) => (
                                <details key={i} className="group bg-white border border-slate-200 rounded-lg open:border-indigo-200 open:bg-indigo-50/30 transition-all">
                                    <summary className="flex items-center justify-between p-4 font-semibold text-slate-700 cursor-pointer list-none">
                                        {item.question}
                                        <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-4 pt-0 text-slate-600 leading-relaxed border-t border-transparent group-open:border-slate-100">
                                        {item.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                     {/* References */}
                    {article.references && article.references.length > 0 && (
                        <div className="border-t border-slate-200 pt-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Referências & Leitura Adicional</h3>
                            <ul className="space-y-2">
                                {article.references.map((ref, i) => (
                                    <li key={i}>
                                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline text-sm">
                                            <ExternalLink size={14} /> {ref.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

const GeneratorPage: React.FC<{ onGenerate: (article: Article) => void }> = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    const newArticle = await generateTutorial(topic);
    setIsLoading(false);

    if (newArticle) {
      onGenerate(newArticle);
      navigate(`/tutorial/${newArticle.id}`);
    } else {
      alert("Erro ao gerar tutorial. Verifique a API Key ou tente novamente.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <div className="mb-10">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Sparkles size={40} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Gerador de Tutoriais IA</h1>
        <p className="text-slate-600 text-lg">
          Não encontrou o que procurava? Nossa Inteligência Artificial pode criar um guia completo e detalhado sobre 
          qualquer assunto para você em segundos.
        </p>
      </div>

      <Card className="p-8 text-left bg-white shadow-xl border-0 ring-1 ring-slate-100">
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">O que você quer aprender?</label>
          <Input 
            placeholder="Ex: Como fazer sushi em casa, Como consertar ventilador..." 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            className="text-lg py-4"
          />
          <Button type="submit" disabled={isLoading || !topic.trim()} className="w-full py-4 text-lg">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Gerando Conteúdo Mágico...
              </>
            ) : (
              <>
                <Sparkles /> Gerar Tutorial Agora
              </>
            )}
          </Button>
          <p className="text-xs text-slate-400 text-center mt-2">
            * O conteúdo é gerado por IA (Gemini) e pode conter imprecisões. Sempre verifique informações críticas de segurança.
          </p>
        </form>
      </Card>

      <div className="mt-12 grid grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Clock size={16} className="text-indigo-500"/> Rápido</h4>
              <p className="text-xs text-slate-500">Gera um guia completo de +1000 palavras em segundos.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Completo</h4>
              <p className="text-xs text-slate-500">Inclui lista de materiais, passo a passo e dicas de mestre.</p>
          </div>
           <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Globe size={16} className="text-blue-500"/> Gratuito</h4>
              <p className="text-xs text-slate-500">Conhecimento ilimitado sem custo algum para você.</p>
          </div>
      </div>
    </div>
  );
};

const SearchPage: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const results = articles.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.introduction.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <SectionHeader title={`Resultados para "${query}"`} subtitle={`${results.length} tutoriais encontrados`} />
      
      {results.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
           {results.map(article => (
            <Link to={`/tutorial/${article.id}`} key={article.id} className="group">
              <Card className="h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <Badge color="blue">{article.category}</Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto">
                    <span className="flex items-center gap-1"><Clock size={14} /> {article.estimatedTime}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
           <p className="text-slate-500 text-lg mb-4">Não encontramos nada com esse termo.</p>
           <Link to="/gerar" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
              Gerar tutorial sobre "{query}" com IA
           </Link>
        </div>
      )}
    </div>
  );
};

const AboutPage: React.FC = () => (
  <div className="container mx-auto px-4 py-20 max-w-3xl">
    <SectionHeader title="Sobre Nós" subtitle="Nossa missão é democratizar o conhecimento prático." />
    <div className="prose prose-lg text-slate-600 mx-auto">
      <p>
        O <strong>Como Fazer</strong> nasceu da ideia de que todos têm a capacidade de criar, consertar e transformar coisas, 
        desde que tenham a instrução correta. Em um mundo cada vez mais descartável, acreditamos no poder do "Faça Você Mesmo" 
        como ferramenta de empoderamento, economia e sustentabilidade.
      </p>
      <p>
        Combinamos curadoria humana especializada com o poder da Inteligência Artificial (Google Gemini) para oferecer a biblioteca 
        mais completa de tutoriais em língua portuguesa. Seja uma receita de família, um conserto doméstico ou uma habilidade técnica, 
        você encontrará aqui.
      </p>
      <h3>Nossos Valores</h3>
      <ul>
        <li><strong>Acessibilidade:</strong> O conhecimento deve ser gratuito e fácil de entender.</li>
        <li><strong>Segurança:</strong> Priorizamos métodos seguros e avisos claros.</li>
        <li><strong>Qualidade:</strong> Conteúdo profundo, não apenas superficial.</li>
      </ul>
    </div>
  </div>
);

const ContactPage: React.FC = () => (
  <div className="container mx-auto px-4 py-20 max-w-xl">
    <SectionHeader title="Fale Conosco" subtitle="Dúvidas, sugestões ou parcerias?" />
    <Card className="p-8">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Nome</label>
          <Input placeholder="Seu nome" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
          <Input type="email" placeholder="seu@email.com" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Mensagem</label>
          <textarea className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all h-32" placeholder="Como podemos ajudar?"></textarea>
        </div>
        <Button className="w-full">Enviar Mensagem</Button>
      </form>
    </Card>
  </div>
);

const PrivacyPage: React.FC = () => (
  <div className="container mx-auto px-4 py-20 max-w-3xl">
    <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
    <div className="prose text-slate-600">
      <p>Esta Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações ao usar nosso site.</p>
      <h3>Coleta de Dados</h3>
      <p>Coletamos informações que você nos fornece diretamente, como ao usar o formulário de contato ou gerar um tutorial. Também usamos cookies para melhorar a experiência de navegação.</p>
      <h3>Uso das Informações</h3>
      <p>Usamos as informações para fornecer, manter e melhorar nossos serviços, incluindo a geração de conteúdo via IA.</p>
      <p>Para mais detalhes, entre em contato conosco.</p>
    </div>
  </div>
);

const TermsPage: React.FC = () => (
  <div className="container mx-auto px-4 py-20 max-w-3xl">
    <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
    <div className="prose text-slate-600">
      <p>Ao acessar este site, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis.</p>
      <h3>Uso de Conteúdo</h3>
      <p>O conteúdo gerado por IA é fornecido "como está", sem garantias de qualquer tipo. O uso das instruções é de inteira responsabilidade do usuário.</p>
      <h3>Propriedade Intelectual</h3>
      <p>O design e código do site são propriedade exclusiva do Como Fazer.</p>
    </div>
  </div>
);

const GlossaryPage: React.FC = () => (
  <div className="container mx-auto px-4 py-20">
    <SectionHeader title="Glossário de Termos" subtitle="Entenda os conceitos técnicos usados nos tutoriais" />
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {[
        { t: "Mise en place", d: "Termo culinário francês que significa 'colocar no lugar'. É a etapa de separar e organizar todos os ingredientes antes de começar a cozinhar." },
        { t: "Banho-maria", d: "Técnica de aquecimento indireto onde um recipiente com o alimento é colocado dentro de outro com água fervente." },
        { t: "Glúten", d: "Combinação de proteínas encontrada no trigo, responsável pela elasticidade da massa de pães." },
        { t: "Criptografia", d: "Prática de codificar informações para que apenas pessoas autorizadas possam lê-las." },
        { t: "Compostagem", d: "Processo biológico de decomposição de matéria orgânica para transformá-la em adubo." }
      ].map((item, i) => (
        <Card key={i} className="p-6">
          <h3 className="font-bold text-indigo-700 text-lg mb-2">{item.t}</h3>
          <p className="text-slate-600">{item.d}</p>
        </Card>
      ))}
    </div>
  </div>
);

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