"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Minus,
  Plus,
  X,
} from "lucide-react";
import type { FrontRecipe } from "@/lib/epicuria-api";

type CookModeProps = {
  isOpen: boolean;
  recipe: FrontRecipe;
  onClose: () => void;
};

function formatElapsedTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  return [minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function scaleAmount(amount: string, servingsRatio: number) {
  const match = amount.match(/^(\d+(?:[.,]\d+)?)(.*)$/);

  if (!match) {
    return amount;
  }

  const rawValue = Number(match[1].replace(",", "."));

  if (Number.isNaN(rawValue)) {
    return amount;
  }

  const scaledValue = rawValue * servingsRatio;
  const formattedValue = Number.isInteger(scaledValue)
    ? String(scaledValue)
    : scaledValue.toFixed(2).replace(/\.?0+$/, "");

  return `${formattedValue}${match[2]}`;
}

export function CookMode({ isOpen, recipe, onClose }: CookModeProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [checkedIngredientIndexes, setCheckedIngredientIndexes] = useState<number[]>([]);
  const [checkedStepIndexes, setCheckedStepIndexes] = useState<number[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [servings, setServings] = useState(() => Number.parseInt(recipe.servings, 10) || 1);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const totalSteps = recipe.steps.length;
  const currentStep = recipe.steps[activeStepIndex] ?? "";
  const baseServings = Number.parseInt(recipe.servings, 10) || 1;
  const servingsRatio = servings / baseServings;
  const completionPercent =
    totalSteps > 0 ? Math.round((checkedStepIndexes.length / totalSteps) * 100) : 0;

  const displayedIngredients = useMemo(
    () =>
      recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        amount: scaleAmount(ingredient.amount, servingsRatio),
      })),
    [recipe.ingredients, servingsRatio]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div aria-modal="true" className="cook-mode-overlay" role="dialog">
      <div className="cook-mode-shell">
        <div className="cook-mode-topbar">
          <div>
            <p className="cook-mode-kicker">Mode cuisine</p>
            <h2>{recipe.title}</h2>
          </div>

          <div className="cook-mode-topbar-actions">
            <div className="cook-mode-chip">
              <Clock3 size={16} />
              {formatElapsedTime(elapsedSeconds)}
            </div>
            <button className="btn btn-secondary btn-round" type="button" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="cook-mode-grid">
          <aside className="cook-mode-sidebar">
            <div className="cook-mode-panel">
              <div className="cook-mode-panel-header">
                <h3>Portions</h3>
                <div className="cook-mode-serving-controls">
                  <button
                    className="btn btn-secondary btn-round"
                    type="button"
                    onClick={() => setServings((current) => Math.max(1, current - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <strong>{servings}</strong>
                  <button
                    className="btn btn-secondary btn-round"
                    type="button"
                    onClick={() => setServings((current) => current + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <p>Les quantites s ajustent automatiquement pour cuisiner avec la bonne mesure.</p>
            </div>

            <div className="cook-mode-panel">
              <div className="cook-mode-panel-header">
                <h3>Ingredients</h3>
                <span>
                  {checkedIngredientIndexes.length}/{displayedIngredients.length}
                </span>
              </div>

              <div className="cook-mode-checklist">
                {displayedIngredients.map((ingredient, index) => {
                  const isChecked = checkedIngredientIndexes.includes(index);

                  return (
                    <button
                      key={`${ingredient.name}-${index}`}
                      className={`cook-mode-checklist-item ${isChecked ? "is-checked" : ""}`}
                      type="button"
                      onClick={() =>
                        setCheckedIngredientIndexes((current) =>
                          current.includes(index)
                            ? current.filter((value) => value !== index)
                            : [...current, index]
                        )
                      }
                    >
                      {isChecked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      <span>{ingredient.name}</span>
                      <b>{ingredient.amount}</b>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="cook-mode-main">
            <div className="cook-mode-panel cook-mode-progress-panel">
              <div className="cook-mode-panel-header">
                <h3>Progression</h3>
                <span>{completionPercent}% termine</span>
              </div>
              <div className="cook-mode-progress-bar">
                <div
                  className="cook-mode-progress-bar-fill"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            <div className="cook-mode-step-card">
              <div className="cook-mode-step-header">
                <div className="step-num">{activeStepIndex + 1}</div>
                <div>
                  <p className="cook-mode-kicker">
                    Etape {activeStepIndex + 1} sur {totalSteps}
                  </p>
                  <h3>Preparation en cours</h3>
                </div>
              </div>

              <p className="cook-mode-step-text">{currentStep}</p>

              <div className="cook-mode-step-actions">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() =>
                    setCheckedStepIndexes((current) =>
                      current.includes(activeStepIndex)
                        ? current.filter((value) => value !== activeStepIndex)
                        : [...current, activeStepIndex]
                    )
                  }
                >
                  <CheckCircle2 size={18} />
                  {checkedStepIndexes.includes(activeStepIndex)
                    ? "Etape terminee"
                    : "Marquer comme faite"}
                </button>

                <div className="cook-mode-nav-buttons">
                  <button
                    className="btn btn-secondary"
                    disabled={activeStepIndex === 0}
                    type="button"
                    onClick={() => setActiveStepIndex((current) => Math.max(0, current - 1))}
                  >
                    <ChevronLeft size={18} />
                    Precedent
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={activeStepIndex === totalSteps - 1}
                    type="button"
                    onClick={() =>
                      setActiveStepIndex((current) => Math.min(totalSteps - 1, current + 1))
                    }
                  >
                    Suivant
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="cook-mode-panel">
              <div className="cook-mode-panel-header">
                <h3>Etapes</h3>
                <span>
                  {checkedStepIndexes.length}/{totalSteps}
                </span>
              </div>

              <div className="cook-mode-steps-list">
                {recipe.steps.map((step, index) => {
                  const isActive = index === activeStepIndex;
                  const isChecked = checkedStepIndexes.includes(index);

                  return (
                    <button
                      key={`${recipe.id}-step-${index + 1}`}
                      className={`cook-mode-steps-item ${isActive ? "is-active" : ""} ${isChecked ? "is-checked" : ""}`}
                      type="button"
                      onClick={() => setActiveStepIndex(index)}
                    >
                      <span className="cook-mode-steps-badge">{index + 1}</span>
                      <span>{step}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
