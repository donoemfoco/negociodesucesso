(function () {
  "use strict";
  var money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function val(id) {
    var el = document.getElementById(id);
    return el ? Math.max(0, Number(String(el.value).replace(",", ".")) || 0) : 0;
  }
  function fmt(n) { return money.format(Number.isFinite(n) ? n : 0); }
  function metric(label, value, note) {
    return '<div class="metric"><span>' + label + '</span><strong>' + value + '</strong>' +
      (note ? '<small>' + note + '</small>' : '') + '</div>';
  }
  function calc() {
    var k = window.TOOL.kind, html = "", note = "";
    if (k === "visit") {
      var cost = val("km") * val("costKm") + val("minutes") / 60 * val("hourValue");
      var margin = Math.min(90, val("margin")) / 100;
      html = metric("Custo estimado da viagem", fmt(cost)) +
        metric("Taxa sugerida", fmt(cost / (1 - margin)), "Com a margem informada, sobre o custo estimado.");
    } else if (k === "supplies") {
      var perService = val("packPrice") / Math.max(val("packUnits"), 0.01) * val("usePerService") * (1 + Math.min(300, val("waste")) / 100);
      html = metric("Custo de insumo por atendimento", fmt(perService)) +
        metric("Custo estimado no mês", fmt(perService * val("monthlyServices")));
    } else if (k === "chair") {
      var rev = val("revenue"), hired = rev - val("hireCost");
      var rental = rev - val("rent") - rev * Math.min(100, val("commission")) / 100;
      html = metric("Saldo no cenário de contratação", fmt(hired), "Após o custo mensal que você informou.") +
        metric("Saldo no cenário de locação", fmt(rental), "Após aluguel e comissão informados.") +
        metric("Diferença entre cenários", fmt(Math.abs(hired - rental)), hired >= rental ? "A contratação deixa maior saldo nesta simulação." : "A locação deixa maior saldo nesta simulação.");
    } else if (k === "equipment") {
      var cash = val("cashPrice"), installments = val("installmentCount") * val("installmentValue");
      var after = val("cashAvailable") - cash;
      html = metric("Total parcelado", fmt(installments)) +
        metric("Diferença entre os totais", fmt(Math.abs(installments - cash)), installments >= cash ? "A opção à vista tem menor total informado." : "A opção parcelada tem menor total informado.") +
        metric("Caixa após pagamento à vista", fmt(after), after < val("reserve") ? "Fica abaixo da reserva mínima escolhida." : "Mantém a reserva mínima informada.");
    } else if (k === "cac") {
      var customers = val("customers"), spend = val("spend"), perCustomer = customers ? spend / customers : 0;
      var contribution = (val("revenue") - val("variableCost")) * customers - spend;
      html = metric("Custo por cliente novo", customers ? fmt(perCustomer) : "Sem vendas informadas", customers ? "Investimento dividido por clientes que compraram." : "Informe ao menos um cliente novo para calcular.") +
        metric("Conversão de lead em cliente", val("leads") ? (customers / val("leads") * 100).toFixed(1).replace(".", ",") + "%" : "Sem leads informados") +
        metric("Contribuição após investimento", fmt(contribution), "Com a receita e os custos variáveis informados.");
    } else if (k === "fees") {
      var pct = Math.min(99, val("feePercent")) / 100;
      var net = val("salePrice") * (1 - pct) - val("fixedFee");
      var gross = (val("targetNet") + val("fixedFee")) / (1 - pct);
      html = metric("Valor líquido estimado", fmt(net)) +
        metric("Preço bruto para a meta líquida", fmt(gross), "Antes de outros custos, impostos e margem.");
    } else if (k === "shift") {
      var marginPer = val("contribution"), breakEven = marginPer ? Math.ceil(val("shiftCost") / marginPer) : 0;
      var profit = val("forecast") * marginPer - val("shiftCost");
      html = metric("Atendimentos para empatar", marginPer ? String(breakEven) : "Informe contribuição", "Limite de capacidade: " + val("capacity") + " atendimentos.") +
        metric("Resultado no volume previsto", fmt(profit), "Com " + val("forecast") + " atendimentos estimados.");
    } else if (k === "reactivation") {
      var returns = val("audience") * Math.min(100, val("responseRate")) / 100 * Math.min(100, val("conversionRate")) / 100;
      var contactCosts = val("audience") * val("contactCost");
      var result = returns * val("contribution") - contactCosts - val("fixedSpend");
      var ceiling = Math.max(0, returns * val("contribution") - val("fixedSpend"));
      html = metric("Retornos estimados", returns.toFixed(1).replace(".", ","), "Estimativa baseada nas taxas informadas.") +
        metric("Resultado após custos da campanha", fmt(result)) +
        metric("Limite para custo por contato", val("audience") ? fmt(ceiling / val("audience")) : fmt(0), "Por contato, mantendo a contribuição esperada e o custo fixo.");
    } else if (k === "seasonal") {
      var monthlyGap = Math.max(0, val("monthlyCosts") - val("monthlyRevenue"));
      var target = monthlyGap * val("monthsLow"), shortage = Math.max(0, target - val("currentReserve"));
      html = metric("Reserva alvo estimada", fmt(target), "Para cobrir o déficit mensal durante o período informado.") +
        metric("Quanto falta separar", fmt(shortage)) +
        metric("Meta mensal de poupança", fmt(shortage / Math.max(1, val("monthsToSave"))), "Até o início da baixa temporada.");
    } else if (k === "capacity") {
      var days = Math.min(7, val("days"));
      var hoursPerDay = val("hours"), blockedPerDay = Math.min(hoursPerDay, val("pause"));
      var availableMinutes = days * Math.max(0, hoursPerDay - blockedPerDay) * 60;
      var duration = Math.max(1, val("duration"));
      var capacity = Math.floor(availableMinutes / duration);
      var booked = Math.min(capacity, val("booked"));
      var free = Math.max(0, capacity - booked);
      html = metric("Capacidade teórica", String(capacity) + " horários", "Com os dias, horas, pausas e duração informados.") +
        metric("Horários ainda livres", String(free), "A conta considera uma duração média por atendimento.") +
        metric("Ocupação da capacidade", capacity ? (booked / capacity * 100).toFixed(1).replace(".", ",") + "%" : "Sem capacidade", "Compare com as reservas reais da semana.");
    }
    var out = document.getElementById("results");
    if (out) out.innerHTML = html;
  }
  var form = document.getElementById("calculator");
  if (form) {
    form.addEventListener("input", calc);
    form.addEventListener("change", calc);
    calc();
  }

  var promo = document.getElementById("promo-modal");
  if (!promo) return;
  var closeButton = promo.querySelector(".promo-close");
  var dismissButton = promo.querySelector(".promo-dismiss");
  var dialog = promo.querySelector(".promo-dialog");
  var promoSeen = false;
  try { promoSeen = sessionStorage.getItem("donoEmFocoPromoSeen") === "1"; } catch (error) {}
  var lastFocus = null;

  function closePromo() {
    promo.setAttribute("aria-hidden", "true");
    document.body.classList.remove("promo-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  function openPromo() {
    if (promoSeen) return;
    promoSeen = true;
    try { sessionStorage.setItem("donoEmFocoPromoSeen", "1"); } catch (error) {}
    lastFocus = document.activeElement;
    promo.setAttribute("aria-hidden", "false");
    document.body.classList.add("promo-open");
    closeButton.focus();
  }
  closeButton.addEventListener("click", closePromo);
  dismissButton.addEventListener("click", closePromo);
  promo.addEventListener("click", function (event) {
    if (event.target === promo) closePromo();
  });
  document.addEventListener("keydown", function (event) {
    if (promo.getAttribute("aria-hidden") === "true") return;
    if (event.key === "Escape") {
      closePromo();
      return;
    }
    if (event.key === "Tab") {
      var controls = dialog.querySelectorAll("a[href], button:not([disabled])");
      var first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  if (!promoSeen) {
    var scrollCheck = function () {
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 160 && window.scrollY / maxScroll >= 0.48) openPromo();
    };
    window.addEventListener("scroll", scrollCheck, { passive: true });
    document.addEventListener("mouseout", function (event) {
      if (event.relatedTarget === null && event.clientY <= 0) openPromo();
    });
  }
}());
