export const tools = [
  {
    slug: "taxa-de-visita-domiciliar",
    name: "Calculadora de taxa de visita domiciliar",
    short: "Descubra quanto cobrar pelo deslocamento sem esquecer tempo, combustível e desgaste do veículo.",
    intent: "quanto cobrar visita domiciliar negócio local",
    category: "Precificação",
    description: "Calcule um valor de deslocamento para atendimentos fora do estabelecimento. Inclua distância, custo por quilômetro, tempo de viagem e margem desejada para visualizar o custo estimado e uma taxa sugerida.",
    fields: [
      { id: "km", label: "Distância total da viagem (ida e volta)", unit: "km", value: 12, step: 1, min: 0, hint: "Some o percurso de ida e volta." },
      { id: "costKm", label: "Combustível e desgaste por quilômetro", unit: "R$/km", value: 1.2, step: 0.1, min: 0, hint: "Use uma estimativa que inclua combustível e manutenção." },
      { id: "minutes", label: "Tempo total de deslocamento", unit: "min", value: 40, step: 5, min: 0, hint: "Considere ida e volta." },
      { id: "hourValue", label: "Valor da sua hora de trabalho", unit: "R$/h", value: 45, step: 5, min: 0, hint: "Estimativa do valor do tempo reservado para a viagem." },
      { id: "margin", label: "Margem sobre o custo", unit: "%", value: 20, step: 1, min: 0, max: 90, hint: "A margem aumenta a taxa acima do custo estimado." }
    ],
    formula: "Custo da viagem = distância × custo por km + horas de viagem × valor da hora. A taxa sugerida divide esse custo por (1 − margem).",
    faqs: [
      ["Devo cobrar a ida e a volta?", "Para saber o custo real do deslocamento, informe a distância total percorrida, incluindo ida e volta."],
      ["O valor sugerido é um preço obrigatório?", "Não. É uma referência calculada com os números informados. Ajuste conforme sua região, concorrência e política comercial."]
    ],
    kind: "visit"
  },
  {
    slug: "custo-real-de-insumos",
    name: "Calculadora de custo real de insumos por serviço",
    short: "Veja quanto do material é consumido em cada atendimento e o impacto da perda no mês.",
    intent: "como calcular custo de material por atendimento",
    category: "Custos",
    description: "Transforme o preço de uma embalagem em custo por atendimento. Informe o quanto usa em cada serviço, uma estimativa de desperdício e o volume mensal para entender o custo unitário e mensal dos insumos.",
    fields: [
      { id: "packPrice", label: "Preço pago pela embalagem", unit: "R$", value: 48, step: 1, min: 0, hint: "Preço total da embalagem que você compra." },
      { id: "packUnits", label: "Quantidade de unidades na embalagem", unit: "un.", value: 24, step: 1, min: 0.01, hint: "Pode ser ml, g, folhas ou aplicações; mantenha a mesma unidade." },
      { id: "usePerService", label: "Quantidade usada em um atendimento", unit: "un.", value: 2, step: 0.1, min: 0, hint: "Quanto do insumo costuma ser usado por serviço." },
      { id: "waste", label: "Perda ou desperdício estimado", unit: "%", value: 8, step: 1, min: 0, max: 300, hint: "Inclua sobras, aplicação extra ou produto vencido." },
      { id: "monthlyServices", label: "Atendimentos no mês", unit: "serviços", value: 80, step: 1, min: 0, hint: "Quantidade mensal aproximada que usa esse insumo." }
    ],
    formula: "Custo por unidade = preço da embalagem ÷ quantidade. Custo por atendimento = custo das unidades usadas × (1 + perda).",
    faqs: [
      ["Posso somar vários produtos?", "Calcule cada insumo separadamente e some os custos por atendimento para chegar ao custo total de materiais."],
      ["Como estimo o desperdício?", "Compare o volume comprado com o que foi efetivamente aplicado em um período. A diferença ajuda a estimar sobras e perdas."]
    ],
    kind: "supplies"
  },
  {
    slug: "contratar-ou-alugar-cadeira",
    name: "Contratar profissional ou alugar cadeira?",
    short: "Compare os resultados mensais usando o faturamento e os custos que você conhece.",
    intent: "vale mais a pena contratar ou alugar cadeira de barbeiro",
    category: "Gestão",
    description: "Compare dois cenários para uma cadeira ou posição de atendimento: profissional contratado com custo mensal estimado por você ou locação com aluguel e comissão. A simulação é gerencial e não substitui orientação trabalhista ou contábil.",
    fields: [
      { id: "revenue", label: "Faturamento mensal gerado pela posição", unit: "R$", value: 6000, step: 100, min: 0, hint: "Use o faturamento que você espera ou já observa." },
      { id: "hireCost", label: "Custo mensal total do cenário de contratação", unit: "R$", value: 3500, step: 100, min: 0, hint: "Informe seu custo estimado, considerando os componentes aplicáveis ao seu caso." },
      { id: "rent", label: "Aluguel mensal da cadeira ou espaço", unit: "R$", value: 900, step: 50, min: 0, hint: "Valor fixo de locação no cenário alternativo." },
      { id: "commission", label: "Comissão paga no cenário de locação", unit: "%", value: 35, step: 1, min: 0, max: 100, hint: "Percentual do faturamento repassado ao profissional." }
    ],
    formula: "Saldo da contratação = faturamento − custo mensal informado. Saldo da locação = faturamento − aluguel − comissão sobre faturamento.",
    faqs: [
      ["A calculadora decide qual modelo posso usar?", "Não. Ela compara apenas os valores que você informa. A forma de contratação precisa ser analisada de acordo com as regras aplicáveis e com orientação profissional."],
      ["O que devo incluir no custo de contratação?", "Use uma estimativa completa preparada com seu contador ou profissional responsável. A ferramenta não calcula encargos nem determina vínculo."]
    ],
    kind: "chair"
  },
  {
    slug: "avista-ou-parcelado-equipamento",
    name: "Equipamento à vista ou parcelado?",
    short: "Compare o desembolso total e confira quanto sobra da sua reserva em cada opção.",
    intent: "comprar equipamento à vista ou parcelado para empresa",
    category: "Caixa",
    description: "Compare o preço à vista com a soma das parcelas e veja o efeito da compra à vista sobre a reserva que você deseja manter no caixa. A conta não estima juros de oportunidade nem recomenda crédito.",
    fields: [
      { id: "cashPrice", label: "Preço à vista", unit: "R$", value: 2400, step: 50, min: 0, hint: "Valor total oferecido para pagamento imediato." },
      { id: "installmentCount", label: "Número de parcelas", unit: "x", value: 10, step: 1, min: 1, hint: "Quantidade de parcelas da outra opção." },
      { id: "installmentValue", label: "Valor de cada parcela", unit: "R$", value: 270, step: 10, min: 0, hint: "Inclua juros e taxas já embutidos na parcela." },
      { id: "cashAvailable", label: "Dinheiro disponível para a compra", unit: "R$", value: 5000, step: 100, min: 0, hint: "Saldo disponível hoje, antes da compra." },
      { id: "reserve", label: "Reserva mínima que deseja manter", unit: "R$", value: 3000, step: 100, min: 0, hint: "Valor que você prefere não comprometer com essa compra." }
    ],
    formula: "Total parcelado = número de parcelas × valor de cada parcela. Saldo após compra à vista = caixa disponível − preço à vista.",
    faqs: [
      ["A simulação considera o custo de deixar o dinheiro aplicado?", "Não. Ela compara os totais e o saldo de caixa informado. Considere impostos, taxas, prazo e alternativas de uso do dinheiro antes de decidir."],
      ["O que significa ficar abaixo da reserva?", "Significa que o saldo informado após a compra ficaria menor do que a reserva mínima que você escolheu."]
    ],
    kind: "equipment"
  },
  {
    slug: "custo-por-cliente-canal",
    name: "Calculadora de custo por cliente adquirido",
    short: "Descubra quanto cada cliente novo custou em um canal e compare com a margem gerada.",
    intent: "quanto custa adquirir um cliente para negócio local",
    category: "Marketing",
    description: "Relacione o investimento em divulgação aos clientes novos que realmente chegaram. Compare o custo por cliente com a contribuição estimada de cada venda para avaliar um canal de aquisição.",
    fields: [
      { id: "spend", label: "Investimento no canal no período", unit: "R$", value: 600, step: 25, min: 0, hint: "Inclua anúncios, criação ou outros custos que queira medir." },
      { id: "leads", label: "Contatos ou pedidos recebidos", unit: "leads", value: 40, step: 1, min: 0, hint: "Pessoas que demonstraram interesse no período." },
      { id: "customers", label: "Clientes novos que compraram", unit: "clientes", value: 12, step: 1, min: 0, hint: "Conte clientes novos, não cliques ou mensagens." },
      { id: "revenue", label: "Receita média por novo cliente", unit: "R$", value: 180, step: 10, min: 0, hint: "Valor médio recebido por cliente no período analisado." },
      { id: "variableCost", label: "Custo variável médio por cliente", unit: "R$", value: 65, step: 5, min: 0, hint: "Materiais, taxas e outros custos ligados à venda." }
    ],
    formula: "Custo por cliente = investimento ÷ clientes novos. Contribuição estimada = (receita média − custo variável) × clientes novos − investimento.",
    faqs: [
      ["Por que usar clientes novos em vez de leads?", "Leads são contatos interessados. Clientes novos são os que compraram. Dividir pelo número de compras mostra o custo de aquisição observado."],
      ["Essa conta mede o valor do cliente ao longo do tempo?", "Não. Ela usa apenas a receita média informada para o período. Recompras futuras precisam ser analisadas separadamente."]
    ],
    kind: "cac"
  },
  {
    slug: "preco-liquido-maquininha",
    name: "Calculadora de preço líquido da maquininha",
    short: "Calcule quanto sobra após a taxa e qual preço bruto alcança o valor líquido desejado.",
    intent: "como calcular taxa da maquininha no preço de venda",
    category: "Precificação",
    description: "Informe o preço cobrado e as taxas para estimar o valor líquido recebido. Também é possível informar quanto deseja receber e encontrar um preço bruto de referência para cobrir a tarifa percentual e a fixa.",
    fields: [
      { id: "salePrice", label: "Preço cobrado do cliente", unit: "R$", value: 100, step: 1, min: 0, hint: "Valor bruto da venda." },
      { id: "feePercent", label: "Taxa percentual da operação", unit: "%", value: 3.5, step: 0.1, min: 0, max: 99, hint: "Use a taxa da bandeira, prazo e modalidade escolhidos." },
      { id: "fixedFee", label: "Tarifa fixa por transação", unit: "R$", value: 0, step: 0.05, min: 0, hint: "Se não houver tarifa fixa, mantenha zero." },
      { id: "targetNet", label: "Valor líquido que deseja receber", unit: "R$", value: 100, step: 1, min: 0, hint: "Meta após descontar as taxas informadas." }
    ],
    formula: "Líquido recebido = preço × (1 − taxa percentual) − tarifa fixa. Preço para a meta líquida = (meta + tarifa fixa) ÷ (1 − taxa percentual).",
    faqs: [
      ["A taxa muda conforme a forma de pagamento?", "Sim. Consulte a condição vigente para débito, crédito, prazo de recebimento e parcelamento e informe a taxa correspondente."],
      ["O preço calculado inclui impostos e custos do serviço?", "Não. A ferramenta considera somente as taxas informadas. Some seus custos, tributos e margem ao definir o preço final."]
    ],
    kind: "fees"
  },
  {
    slug: "vale-abrir-mais-um-turno",
    name: "Vale abrir mais um turno de atendimento?",
    short: "Estime quantos atendimentos pagam o custo incremental de abrir em outro horário.",
    intent: "como saber se vale abrir mais um turno no negócio",
    category: "Operação",
    description: "Calcule o ponto de equilíbrio de um horário adicional a partir dos custos extras e da contribuição média por atendimento. Compare o limite de capacidade com a demanda que você espera.",
    fields: [
      { id: "shiftCost", label: "Custo extra para abrir o turno", unit: "R$", value: 480, step: 20, min: 0, hint: "Equipe, energia, transporte e outros custos incrementais." },
      { id: "contribution", label: "Contribuição média por atendimento", unit: "R$", value: 60, step: 5, min: 0, hint: "Receita menos custos variáveis diretamente ligados ao atendimento." },
      { id: "capacity", label: "Capacidade máxima no novo turno", unit: "atendimentos", value: 16, step: 1, min: 0, hint: "Quantidade que a equipe consegue atender nesse horário." },
      { id: "forecast", label: "Atendimentos que espera realizar", unit: "atendimentos", value: 10, step: 1, min: 0, hint: "Estimativa realista com base nos pedidos ou histórico." }
    ],
    formula: "Atendimentos para empatar = custo extra ÷ contribuição por atendimento. Resultado projetado = atendimentos previstos × contribuição − custo extra.",
    faqs: [
      ["O cálculo considera faturamento ou lucro?", "Usa a contribuição por atendimento que você informa, já descontados os custos variáveis considerados por você."],
      ["Como estimar a demanda do novo horário?", "Use lista de espera, pedidos recusados e disponibilidade informada por clientes para evitar depender apenas de uma hipótese."]
    ],
    kind: "shift"
  },
  {
    slug: "teto-de-gasto-reativacao",
    name: "Quanto investir para reativar clientes?",
    short: "Estime o limite de investimento em uma campanha de retorno usando sua margem e resposta esperada.",
    intent: "quanto investir para trazer clientes antigos de volta",
    category: "Marketing",
    description: "Projete uma campanha de reativação com tamanho da lista, resposta esperada, custo de contato e contribuição por retorno. Veja o resultado estimado e o limite de custo variável antes de investir.",
    fields: [
      { id: "audience", label: "Clientes que podem receber a campanha", unit: "pessoas", value: 150, step: 5, min: 0, hint: "Use apenas contatos com autorização para receber sua comunicação." },
      { id: "responseRate", label: "Percentual que espera responder", unit: "%", value: 12, step: 1, min: 0, max: 100, hint: "Use resultados anteriores ou uma hipótese conservadora." },
      { id: "conversionRate", label: "Percentual de respostas que deve comprar", unit: "%", value: 50, step: 1, min: 0, max: 100, hint: "Estimativa de conversão entre quem responde." },
      { id: "contactCost", label: "Custo variável por contato", unit: "R$", value: 0.2, step: 0.05, min: 0, hint: "Custo de mensagem, ligação ou incentivo por pessoa alcançada." },
      { id: "contribution", label: "Contribuição por cliente que voltar", unit: "R$", value: 75, step: 5, min: 0, hint: "Receita esperada menos custos variáveis do novo serviço." },
      { id: "fixedSpend", label: "Outros custos fixos da campanha", unit: "R$", value: 100, step: 10, min: 0, hint: "Criação, ferramenta ou produção de material." }
    ],
    formula: "Retornos esperados = lista × taxa de resposta × conversão. Resultado estimado = retornos × contribuição − custo dos contatos − custos fixos.",
    faqs: [
      ["O teto calculado garante retorno?", "Não. É uma projeção que depende das taxas informadas. Faça um teste pequeno e compare o resultado real antes de ampliar."],
      ["Posso usar qualquer lista de contatos?", "Use somente contatos que possam receber sua comunicação e respeite as preferências de descadastro e as regras de privacidade."]
    ],
    kind: "reactivation"
  },
  {
    slug: "capital-de-giro-baixa-temporada",
    name: "Calculadora de reserva para baixa temporada",
    short: "Estime o caixa necessário para atravessar meses fracos e quanto falta guardar.",
    intent: "quanto guardar para baixa temporada negócio local",
    category: "Caixa",
    description: "Use seus custos essenciais e a duração prevista da baixa temporada para dimensionar uma reserva de caixa. A ferramenta desconta a reserva atual e estima uma meta mensal de poupança antes do período fraco.",
    fields: [
      { id: "monthlyCosts", label: "Custos essenciais mensais", unit: "R$", value: 7500, step: 100, min: 0, hint: "Inclua compromissos que continuam durante a baixa temporada." },
      { id: "monthsLow", label: "Meses de baixa temporada", unit: "meses", value: 3, step: 1, min: 0, hint: "Duração estimada do período mais fraco." },
      { id: "monthlyRevenue", label: "Receita mensal esperada nesse período", unit: "R$", value: 4500, step: 100, min: 0, hint: "Estimativa conservadora de entradas durante a baixa." },
      { id: "currentReserve", label: "Reserva já separada", unit: "R$", value: 5000, step: 100, min: 0, hint: "Caixa reservado especificamente para atravessar esse período." },
      { id: "monthsToSave", label: "Meses disponíveis para formar a reserva", unit: "meses", value: 6, step: 1, min: 1, hint: "Tempo até o início da baixa temporada." }
    ],
    formula: "Necessidade líquida por mês = custos essenciais − receita esperada. Reserva alvo = necessidade líquida × meses fracos. Meta mensal = valor que falta ÷ meses disponíveis.",
    faqs: [
      ["A calculadora prevê exatamente o caixa que vou precisar?", "Não. Custos e entradas podem variar. Use um cenário conservador, atualize as estimativas e mantenha uma margem para imprevistos."],
      ["Devo guardar o faturamento bruto?", "A ferramenta compara custos essenciais e receita esperada informados. Ajuste as entradas para refletir o dinheiro que realmente estará disponível."]
    ],
    kind: "seasonal"
  }
];
