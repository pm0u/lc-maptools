const HIGHLIGHTED_SUFFIX = "#HIGHLIGHTED";
const SELECTED_SUFFIX = "#SELECTED";

const STATE_SUFFIXES = [HIGHLIGHTED_SUFFIX, SELECTED_SUFFIX];

export const getHighlightLayer = (id: string) => {
  return `${getBaseLayer(id)}${HIGHLIGHTED_SUFFIX}`;
};

export const getSelectedLayer = (id: string) => {
  return `${getBaseLayer(id)}${SELECTED_SUFFIX}`;
};

export const getBaseLayer = (id: string) => {
  return STATE_SUFFIXES.reduce((str, suffix) => str.replace(suffix, ""), id);
};
