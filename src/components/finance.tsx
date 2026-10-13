"use client";
import { useState } from "react";
import { ArrowUpRight, Info, Minus, Plus } from "lucide-react";
import { money } from "@/lib/vehicles";
import { whatsapp } from "@/config/site";
export function FinanceSimulator({
  initialPrice = 129900,
  compact = false,
}: {
  initialPrice?: number;
  compact?: boolean;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [entry, setEntry] = useState(Math.round(initialPrice * 0.3));
  const [months, setMonths] = useState(48);
  const [rate, setRate] = useState(1.79);
  const safeEntry = Math.min(Math.max(entry, 0), price),
    principal = Math.max(price - safeEntry, 0),
    r = rate / 100;
  const installment =
    r === 0
      ? principal / months
      : (principal * r) / (1 - Math.pow(1 + r, -months));
  return (
    <div className={`finance-simulator ${compact ? "compact" : ""}`}>
      <div className="finance-inputs">
        <div className="filter-pair">
          <label>
            Valor do veículo (R$)
            <input
              type="number"
              min="1000"
              max="5000000"
              value={price}
              onChange={(e) => {
                const n = Math.min(
                  5000000,
                  Math.max(0, Number(e.target.value)),
                );
                setPrice(n);
                if (entry > n) setEntry(n);
              }}
            />
          </label>
          <label>
            Sua entrada (R$)
            <input
              type="number"
              min="0"
              max={price}
              value={entry}
              onChange={(e) =>
                setEntry(Math.min(price, Math.max(0, Number(e.target.value))))
              }
            />
          </label>
        </div>
        <label className="range-label">
          <span>
            Entrada{" "}
            <strong>
              {price ? Math.round((safeEntry / price) * 100) : 0}%
            </strong>
          </span>
          <input
            type="range"
            min="0"
            max={price}
            step="100"
            value={safeEntry}
            onChange={(e) => setEntry(Number(e.target.value))}
          />
        </label>
        <fieldset className="terms">
          <legend>Em quantas parcelas?</legend>
          <div>
            {[12, 24, 36, 48, 60].map((m) => (
              <button
                key={m}
                type="button"
                className={months === m ? "active" : ""}
                onClick={() => setMonths(m)}
                aria-pressed={months === m}
              >
                {m}x
              </button>
            ))}
          </div>
        </fieldset>
        <label className="rate-label">
          Taxa estimada ao mês
          <div>
            <button
              aria-label="Diminuir taxa"
              className="icon-button"
              type="button"
              onClick={() =>
                setRate(Math.max(0, Number((rate - 0.1).toFixed(2))))
              }
            >
              <Minus size={16} />
            </button>
            <input
              aria-label="Taxa mensal em porcentagem"
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={rate}
              onChange={(e) =>
                setRate(Math.min(10, Math.max(0, Number(e.target.value))))
              }
            />
            <span>%</span>
            <button
              aria-label="Aumentar taxa"
              className="icon-button"
              type="button"
              onClick={() =>
                setRate(Math.min(10, Number((rate + 0.1).toFixed(2))))
              }
            >
              <Plus size={16} />
            </button>
          </div>
        </label>
      </div>
      <div className="finance-result" aria-live="polite">
        <span>Um novo caminho em</span>
        <p>
          <strong>{money(installment)}</strong>
          <span>/ mês</span>
        </p>
        <span>
          {months} parcelas · entrada de {money(safeEntry)}
        </span>
        <dl>
          <div>
            <dt>Valor financiado</dt>
            <dd>{money(principal)}</dd>
          </div>
          <div>
            <dt>Total das parcelas</dt>
            <dd>{money(installment * months)}</dd>
          </div>
          <div>
            <dt>Juros estimados</dt>
            <dd>{money(installment * months - principal)}</dd>
          </div>
        </dl>
        <a
          className="button button-cream"
          href={whatsapp(
            `Olá! Simulei um veículo de ${money(price)}, com entrada de ${money(safeEntry)} e prazo de ${months} meses. Gostaria de conversar sobre financiamento.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Conversar sobre a simulação
          <ArrowUpRight size={18} />
        </a>
        <p className="simulation-note">
          <Info size={15} />
          Simulação ilustrativa, sem valor contratual. Não inclui IOF, tarifas,
          seguros ou CET. Taxas e aprovação dependem da análise da instituição
          financeira.
        </p>
      </div>
    </div>
  );
}
