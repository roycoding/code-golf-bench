/* Shared model annotations for the leaderboard and model results. */
window.CodegolfDetails = (() => {
  function escape(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function modelId(result) {
    const metadata = result.model_metadata || {};
    if (metadata.provider !== "OpenRouter") return "";
    return [metadata.model_id, metadata.requested_model, result.model]
      .find((value) => typeof value === "string" && /^[\w~-]+\/[\w.:-]+$/.test(value)) || "";
  }

  function openRouterUrl(result) {
    const id = modelId(result);
    return id ? `https://openrouter.ai/${id}` : "";
  }

  function annotations(result, full = false) {
    const id = modelId(result);
    const info = window.CODEGOLF_MODEL_INFO?.[id];
    const url = openRouterUrl(result);
    const parts = [];
    if (info?.open_weight === true) {
      parts.push(full
        ? `<a class="open-weight-badge" href="${escape(info.source_url)}" target="_blank" rel="noopener noreferrer" title="Open weights · checked ${escape(info.checked_on)} · view source (opens in a new tab)" aria-label="${escape(id)}: open weights, view source (opens in a new tab)">Open weights</a>`
        : `<span class="open-weight-badge" title="Open weights · checked ${escape(info.checked_on)} · source on model page" aria-label="Open weights">OW</span>`);
    }
    if (url && full) {
      parts.unshift(`<a class="openrouter-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer" title="Model information for ${escape(id)}: specifications and pricing on OpenRouter (opens in a new tab)" aria-label="Model information for ${escape(id)} on OpenRouter (opens in a new tab)"><span class="model-info-copy"><strong>Model information</strong><span>Specs &amp; pricing on OpenRouter</span></span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 2h5v5M14 2 7 9M6 3H2v11h11v-4"/></svg></a>`);
    }
    return parts.join(" ");
  }

  function evaluationDate(result) {
    const value = result.model_metadata?.evaluation_date;
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : "";
  }

  function dateCell(result) {
    const date = evaluationDate(result);
    return date ? `<time datetime="${date}">${date}</time>` : "Not recorded";
  }

  function testedTitle(result) {
    const items = result.results_by_course ? [...result.results_by_course.values()] : [result];
    return items.map((item) => `${item.course || "python"}: ${evaluationDate(item) || "date not recorded"}`).join("; ");
  }

  function zeroPenalty(result) {
    if (result.complete === false) return false;
    const value = result.penalty_points;
    if (value !== null && value !== undefined && value !== "") {
      return Number.isFinite(Number(value)) && Number(value) === 0;
    }
    // Missing data must not look like a perfect result.
    return typeof result.score === "number" && typeof result.raw_bytes === "number"
      && Number.isFinite(result.score) && result.score === result.raw_bytes;
  }

  function scoreCell(result, formattedScore) {
    const clean = zeroPenalty(result);
    return `<td class="number${clean ? " zero-penalty" : ""}">${clean ? '<span class="zero-penalty-mark" role="img" aria-label="Zero penalty points" title="Zero penalty points">✓</span> ' : ""}${escape(formattedScore)}</td>`;
  }

  return { modelId, openRouterUrl, annotations, evaluationDate, dateCell, testedTitle, zeroPenalty, scoreCell };
})();
