export const niches = [
  {
    slug: "barbearia", name: "Barbearia", label: "barbearia", emoji: "💈", intent: "agenda online para barbearia",
    focus: "Organize duração de corte, barba e combinações de serviços para evitar encaixes que empurram a agenda.",
    checklist: ["Separe os serviços pelo tempo real de cadeira", "Reserve intervalos para atrasos e limpeza", "Defina como atender encaixes sem perder os horários marcados"],
    workflow: "Compare a ocupação por barbeiro e por faixa de horário. Se recebe clientes sem reserva, mantenha uma regra clara para encaixes e mostre no WhatsApp quando vale marcar antes."
  },
  {
    slug: "salao-de-beleza", name: "Salão de beleza", label: "salão de beleza", emoji: "💇", intent: "sistema de agendamento para salão de beleza",
    focus: "Planeje serviços com tempos diferentes, profissionais compartilhados e pausas entre etapas.",
    checklist: ["Cadastre cada serviço com o tempo de execução completo", "Considere quando um serviço ocupa mais de um profissional", "Evite sobrepor lavatório, cadeira e etapas de finalização"],
    workflow: "Faça um teste de marcação para cada serviço mais procurado. Confira se a duração inclui preparação, execução e finalização antes de compartilhar o link da agenda."
  },
  {
    slug: "manicure", name: "Estúdio de unhas", label: "estúdio de unhas", emoji: "💅", intent: "agenda online para manicure e estúdio de unhas",
    focus: "Diferencie manutenção, esmaltação e alongamento pelo tempo de mesa que cada serviço exige.",
    checklist: ["Separe serviços rápidos de procedimentos mais longos", "Inclua o tempo de preparação e troca de materiais", "Ofereça uma forma simples de pedir manutenção ou remoção"],
    workflow: "Observe quais serviços deixam intervalos difíceis de aproveitar. Ajuste a duração com base na sua rotina e informe o que a cliente precisa escolher ao marcar."
  },
  {
    slug: "sobrancelha", name: "Estúdio de sobrancelha", label: "estúdio de sobrancelha", emoji: "✨", intent: "agendamento online para design de sobrancelha",
    focus: "Organize serviços individuais e combinações sem deixar dúvida sobre o tempo reservado.",
    checklist: ["Dê nomes claros para design, henna e combinações", "Informe a duração estimada de cada opção", "Reserve um intervalo realista para higienizar e preparar a estação"],
    workflow: "Revise se o cliente consegue distinguir cada serviço antes de escolher o horário. Use a confirmação para repetir a opção marcada e facilitar alterações."
  },
  {
    slug: "estetica", name: "Clínica de estética", label: "clínica de estética", emoji: "🧖", intent: "sistema de agenda para clínica de estética",
    focus: "Separe avaliação, sessão e retorno, preservando o tempo de preparação e registro da equipe.",
    checklist: ["Identifique avaliação e sessão como etapas diferentes quando necessário", "Bloqueie o intervalo necessário para preparar a sala", "Explique como remarcar sem confundir uma sessão com outra"],
    workflow: "Antes de automatizar a confirmação, revise quais informações podem ser coletadas com segurança. Deixe um caminho humano para dúvidas que dependam de avaliação profissional."
  },
  {
    slug: "maquiagem", name: "Estúdio de maquiagem", label: "estúdio de maquiagem", emoji: "💄", intent: "agenda online para maquiadora",
    focus: "Distribua teste, produção e deslocamento sem ocupar duas reservas no mesmo período.",
    checklist: ["Diferencie atendimento no estúdio e a domicílio", "Reserve o tempo de montagem e desmontagem dos materiais", "Registre endereço e horário do evento após confirmar o serviço"],
    workflow: "Em datas de evento, confira o tempo de deslocamento entre compromissos e a duração total da produção. Deixe condições de reserva e alteração visíveis antes da confirmação."
  },
  {
    slug: "petshop", name: "Pet shop", label: "pet shop", emoji: "🐾", intent: "agendamento online para banho e tosa",
    focus: "Organize banho, tosa e serviços adicionais considerando o tempo e a capacidade real da equipe.",
    checklist: ["Peça apenas as informações necessárias para identificar o serviço", "Separe banho, tosa e adicionais na agenda", "Evite prometer um horário de retirada antes de confirmar a capacidade"],
    workflow: "Defina como a equipe confirma porte, serviço e previsão de conclusão. Para situações que exigem avaliação individual, encaminhe a conversa para uma pessoa antes de reservar."
  },
  {
    slug: "automotiva", name: "Estética automotiva", label: "estética automotiva", emoji: "🚗", intent: "agenda online para estética automotiva e lava-car",
    focus: "Planeje a ocupação de boxes e equipamentos além da duração estimada do serviço.",
    checklist: ["Separe lavagem, polimento e higienização por tipo de serviço", "Considere o tempo em que o box e o equipamento ficam ocupados", "Confirme o veículo e o serviço antes de bloquear a vaga"],
    workflow: "Use a agenda para distribuir serviços que ocupam o mesmo box ou equipamento. Informe se a duração é estimada e confirme detalhes do veículo pelo canal de atendimento."
  },
  {
    slug: "tatuagem", name: "Estúdio de tatuagem", label: "estúdio de tatuagem", emoji: "🖋️", intent: "sistema de agenda para estúdio de tatuagem",
    focus: "Separe conversa inicial, preparação e sessão para reservar o tempo correto de cada etapa.",
    checklist: ["Diferencie consulta de projeto e sessão", "Informe como a equipe confirma duração e disponibilidade", "Explique com antecedência as regras de reserva e remarcação"],
    workflow: "Nem todo pedido pode ser confirmado apenas por duração padrão. Encaminhe projeto, localização e dúvidas para o profissional antes de bloquear uma sessão longa."
  }
];
